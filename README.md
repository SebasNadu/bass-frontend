# BASS frontend

## `useApi` Hook Documentation.

A reusable React hook for handling API requests with **fetch**, including:

- ✅ Works with `GET`, `POST`, `PUT`, `DELETE`, etc.
- ✅ Automatic JSON parsing
- ✅ `loading`, `error`, and `data` states
- ✅ Optional `autoFetch` for initial load
- ✅ Safe cancellation with `AbortController`

---

## 🔧 Installation

No extra dependencies are required.

1. GET

```ts
import { useApi } from "@/hooks/useApi";


⸻

🚀 Usage Examples

1. GET Request with Auto Fetch

const { data, loading, error } = useApi<User[]>("/api/users", {
  autoFetch: true,
});

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;

return (
  <ul>
    {data?.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

- autoFetch: true → runs once when the component mounts
- data → contains JSON response
- loading → shows when fetch is running
- error → holds error if request fails

⸻

2. POST Request (Manual Execution)

```ts
const { data, loading, error, execute } = useApi<User, Partial<User>>(
"/api/users",
{ method: "POST" }
);

const addUser = () => {
execute({
body: { name: "Sebas", email: "<test@example.com>" },
});
};

return (

  <div>
    <button onClick={addUser} disabled={loading}>
      Add User
    </button>
    {loading && <p>Saving...</p>}
    {error && <p>Error: {error.message}</p>}
    {data && <p>Created: {data.name}</p>}
  </div>
);
```

- execute() triggers request manually
- body object is automatically JSON.stringified
- Can override method, headers, body at call-time

⸻

3. Overriding Options Per Call

```ts
const { execute } = useApi("/api/users");

// Custom GET with headers
execute({
  headers: { Authorization: "Bearer mytoken" },
});

// POST with body
execute({
  method: "POST",
  body: { name: "New User" },
});
```

⸻

4. Handling AbortController (Cancellation)

Every request inside useApi uses an AbortController.
If the request is canceled (e.g., component unmounts), the error is ignored.

Example with useEffect cleanup:

```ts
const { execute } = useApi("/api/data");

useEffect(() => {
  const controller = new AbortController();

  execute({
    headers: { Authorization: "Bearer mytoken" },
    body: { filter: "active" },
  });

  return () => controller.abort(); // cancel on unmount
}, [execute]);
```

⸻

📖 API Reference

```ts
useApi<T, B>(url, options?)
```

### Parameters

- url: string – API endpoint.
- options: UseApiOptions<B>
- method?: string – HTTP method (default "GET").
- headers?: HeadersInit – Custom headers.
- body?: B – Request body (object/string).
- autoFetch?: boolean – Auto-executes once on mount.

### Returns: UseApiResult<T, B>

- data: T | null – Response JSON.
- loading: boolean – Loading state.
- error: Error | null – Error object if failed.
- execute(overrideOptions?: UseApiOptions<B>): Promise<void> – Manually executes request.

⸻

## Notes

- For JSON requests, Content-Type: application/json is automatically added.
- AbortController prevents state updates if the request is canceled.
- Errors of type "AbortError" are silently ignored.
