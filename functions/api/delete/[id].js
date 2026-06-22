export async function onRequestDelete({ params, env }) {
  const id = params.id;

  // Check if the record exists
  const exists = await env.CONTACTS.get(id);
  if (!exists) {
    return new Response(
      JSON.stringify({ success: false, error: "Record not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Delete the record
  await env.CONTACTS.delete(id);

  return new Response(
    JSON.stringify({ success: true, id }),
    { headers: { "Content-Type": "application/json" } }
  );
}
