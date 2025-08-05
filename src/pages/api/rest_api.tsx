export const baseUrl = "http://localhost:3000";

export async function getProperties() {
  const res = await fetch(`${baseUrl}/api/properties`);
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export async function deleteProperty(id: number) {
  const res = await fetch(`${baseUrl}/api/properties/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}
