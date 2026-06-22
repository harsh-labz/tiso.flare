export async function onRequestPost({ request }) {
  try {
    const data = await request.json();

    const {
      email,
      fname,
      lname,
      message,
      extra,
      country
    } = data;

    // Build MailChannels payload
    const payload = {
      personalizations: [
        {
          to: [{ email: "contact@theitserver.org", name: "The IT Server" }],
          dkim_domain: "theitserver.org",
          dkim_selector: "mailchannels",
          dkim_private_key: undefined
        }
      ],
      from: {
        email: "no-reply@theitserver.org",
        name: "Website Contact Form"
      },
      reply_to: {
        email,
        name: `${fname} ${lname}`
      },
      subject: `New Contact Form Submission from ${fname} ${lname}`,
      content: [
        {
          type: "text/plain",
          value: `
New contact form submission:

Name: ${fname} ${lname}
Email: ${email}
Country: ${country}
Message: ${message}

Extra:
${extra || "(none)"}
          `.trim()
        }
      ]
    };

    // ⭐ Correct MailChannels endpoint
    const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // MailChannels returns 202 on success
    if (response.status === 202) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Log error for debugging
    const errorText = await response.text();
    console.log("MailChannels Error:", errorText);

    return new Response(JSON.stringify({ success: false, error: errorText }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.log("Server Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
