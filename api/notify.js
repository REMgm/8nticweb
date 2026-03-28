export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
  }

  const fromAddress = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const toAddress = process.env.NOTIFY_EMAIL || 'rem@8ntic.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: toAddress,
        subject: `New 8NTIC contact: ${name}`,
        html: `
          <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
            <div style="border-bottom: 2px solid #4F6DFF; padding-bottom: 16px; margin-bottom: 24px;">
              <h2 style="margin: 0; color: #111;">New Contact Submission</h2>
              <p style="margin: 4px 0 0; color: #666; font-size: 14px;">8nticweb.vercel.app</p>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 80px; vertical-align: top;">Name</td>
                <td style="padding: 8px 0; color: #111; font-weight: 500;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; vertical-align: top;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4F6DFF;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; vertical-align: top;">Message</td>
                <td style="padding: 8px 0; color: #111;">${message || '<em style="color: #999;">No message provided</em>'}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              Sent from 8NTIC contact form
            </div>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Email delivery failed', detail: data });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', detail: err.message });
  }
}
