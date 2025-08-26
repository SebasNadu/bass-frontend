import { Form, Input, Button } from "@heroui/react";
import { useState, useEffect } from "react";
import { Select, SelectItem } from "@heroui/react";

// Define day options
const dayOptions = [
  { name: "MONDAY", displayName: "Monday" },
  { name: "TUESDAY", displayName: "Tuesday" },
  { name: "WEDNESDAY", displayName: "Wednesday" },
  { name: "THURSDAY", displayName: "Thursday" },
  { name: "FRIDAY", displayName: "Friday" },
  { name: "SATURDAY", displayName: "Saturday" },
  { name: "SUNDAY", displayName: "Sunday" },
];

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tagsId, setTagsId] = useState<Array<number>>([]);
  const [days, setDays] = useState<Array<string>>([]);
  const [tagOptions, setTagOptions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/tags");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }

        const data = await response.json();
        setTagOptions(data);
      } catch (err) {
        setError("Error fetching tags");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (days.length !== 2) {
      alert("Please select exactly 2 days.");
      return;
    }

    console.log("Selected tags:", tagsId);
    console.log("Selected days:", days);
  };

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = e.target.value.split(",").map((id) => parseInt(id, 10));
    setTagsId(selectedIds);
  };

  const handleDaySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDays = e.target.value.split(",");
    setDays(selectedDays);
  };

  return (
    <Form
      className="w-full max-w-xs"
      validationBehavior="aria"
      onSubmit={onSubmit}
    >
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        validate={(value) => {
          if (value.length == 0) {
            return "Introduce a valid name";
          }
        }}
      />
      <Input
        isRequired
        errorMessage="Please enter a valid email"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        validate={(value) => {
          if (!value.includes("@")) {
            return "It must be a valid email";
          }
        }}
      />
      <Input
        isRequired
        label="Password"
        labelPlacement="outside"
        name="password"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        validate={(value) => {
          if (value.length == 0) {
            return "Introduce a valid password";
          }
        }}
      />

      {/* Tag Selection */}
      <div className="flex w-full max-w-xs flex-col gap-2 mt-4">
        {loading ? (
          <p>Loading tags...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <Select
            className="max-w-xs"
            label="Preferences"
            placeholder="Select tags"
            selectedKeys={new Set(tagsId.map((id) => id.toString()))}
            selectionMode="multiple"
            onChange={handleTagSelect}
          >
            {tagOptions.map((tag) => (
              <SelectItem key={tag.id}>{tag.name}</SelectItem>
            ))}
          </Select>
        )}
        <p className="text-small text-default-500 mt-2">
          Selected tags:{" "}
          {tagsId
            .map((id) => tagOptions.find((tag) => tag.id === id)?.name)
            .join(", ")}
        </p>
      </div>

      {/* Day Selection */}
      <div className="flex w-full max-w-xs flex-col gap-2 mt-4">
        <Select
          className="max-w-xs"
          label="Select Days"
          placeholder="Select 2 days"
          selectedKeys={new Set(days)}
          selectionMode="multiple"
          onChange={handleDaySelect}
        >
          {dayOptions.map((day) => (
            <SelectItem key={day.name}>{day.displayName}</SelectItem>
          ))}
        </Select>
        <p className="text-small text-default-500 mt-2">
          Selected days: {days.join(", ")}
        </p>
      </div>

      <Button color="primary" variant="ghost" type="submit">
        Submit
      </Button>
    </Form>
  );
}
