import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";
import { Select, SelectItem } from "@heroui/react";

const tagOptions = [
  { id: 1, name: "Healthy" },
  { id: 2, name: "Vegan" },
  { id: 3, name: "Hipster" },
];

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tagsId, setTagsId] = useState<Array<number>>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Selected tags:", tagsId);
  };

  const handleTagSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = e.target.value.split(",").map((id) => parseInt(id, 10));
    setTagsId(selectedIds);
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
            return "It must be  valid email";
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

      <div className="flex w-full max-w-xs flex-col gap-2 mt-4">
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
        <p className="text-small text-default-500 mt-2">
          Selected tags:{" "}
          {tagsId
            .map((id) => tagOptions.find((tag) => tag.id === id)?.name)
            .join(", ")}
        </p>
      </div>
      <Button color="primary" variant="ghost" type="submit">
        Submit
      </Button>
    </Form>
  );
}
