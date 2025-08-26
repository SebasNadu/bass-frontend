import { useState, useCallback, useEffect } from "react";
import { BASE_URL } from "@/config/api";

type Data<T> = T | null;
type ErrorType = Error | null;

interface UseApiOptions<B> {
  method?: string;
  headers?: HeadersInit;
  body?: B;
  autoFetch?: boolean;
}

interface UseApiResult<T, B> {
  data: Data<T>;
  loading: boolean;
  error: ErrorType;
  execute: (overrideOptions?: UseApiOptions<B>) => Promise<void>;
}

export function useApi<T = unknown, B = unknown>(
  path: string,
  options: UseApiOptions<B> = {}
): UseApiResult<T, B> {
  const url = `${BASE_URL}${path}`;
  const [data, setData] = useState<Data<T>>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(null);

  const execute = useCallback(
    async (overrideOptions?: UseApiOptions<B>): Promise<void> => {
      const controller = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const mergedOptions = {
          method: options.method ?? "GET",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
            ...overrideOptions?.headers,
          },
          body:
            (overrideOptions?.body ?? options.body) !== undefined
              ? JSON.stringify(overrideOptions?.body ?? options.body)
              : undefined,
          signal: controller.signal,
        };

        const response = await fetch(url, mergedOptions);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        const jsonData: T = isJson ? await response.json() : (null as T);

        setData(jsonData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    if (options.autoFetch) {
      execute();
    }
  }, [execute, options.autoFetch]);

  return { data, loading, error, execute };
}
