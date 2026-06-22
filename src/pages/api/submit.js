export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();

    // Add metadata
    const enriched = {
      ...body,
      receivedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || ""
    };

    // 1. Get OAuth token
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials"
        })
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Upload JSON file to OneDrive
    const filename = `lead-${Date.now()}.json`;

    const uploadRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:/Projects/tiso_files/_leads/${filename}:/content`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(enriched)
      }
    );

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return new Response("Upload failed: " + err, { status: 500 });
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
