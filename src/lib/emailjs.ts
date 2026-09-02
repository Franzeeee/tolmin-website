// Server-side sender for EmailJS (https://www.emailjs.com/docs/rest-api/send/).
// Requires EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID and EMAILJS_PUBLIC_KEY.
// EMAILJS_PRIVATE_KEY is required too — EmailJS blocks calls made outside a
// browser (like this Next.js API route) unless a private key is sent.
export async function sendEmailJs(templateParams: Record<string, string | number>) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('⚠️ EmailJS is not configured — skipping email.');
    return;
  }

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: privateKey,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS send failed: ${res.status} ${text}`);
  }
}

export const ORDER_NOTIFICATION_TO = 'bastygarcela19@gmail.com';
