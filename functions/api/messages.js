export async function onRequestGet({ env }) {
  const list = await env.CONTACTS.list();

  const results = [];
  for (const item of list.keys) {
    const value = await env.CONTACTS.get(item.name);
    if (value) results.push(JSON.parse(value));
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}
