export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();

    const timestamp = Date.now();
    const key = `contact:${timestamp}`;

    const record = {
      id: key,
      created: new Date(timestamp).toISOString(),
      ...data
    };

    await env.CONTACTS.put(key, JSON.stringify(record));

    return new Response(
      JSON.stringify({ success: true, id: key }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}