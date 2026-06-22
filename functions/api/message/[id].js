export async function onRequestGet({ params, env }) {
  const id = params.id;
  const value = await env.CONTACTS.get(id);

  if (!value) {
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(value, {
    headers: { "Content-Type": "application/json" }
  });
}
