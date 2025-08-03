export const baseUrl = "http://localhost:3000/api";

export async function getProperties() {
  const res = await fetch(`${baseUrl}/properties`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export async function deleteUser(id: number) {
  const res = await fetch(`${baseUrl}/properties/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}
