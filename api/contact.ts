const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CONTACT_EMAIL = process.env.VITE_CONTACT_EMAIL;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
}

interface ProjectInquiryData {
  formType: "project-inquiry";
  services: string[];
  projectName: string;
  description: string;
  hasAssets: string;
  currency: string;
  budget: string;
  startTimeline: string;
  name: string;
  email: string;
  phone: string;
  referralSource: string;
}

/* ── Main handler ── */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  if (req.body.formType === "project-inquiry") {
    return handleProjectInquiry(req, res);
  }

  return handleContactSubmission(req, res);
}

/* ── Shared email trigger ── */

async function triggerEmail(subject: string, htmlContent: string) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "BuildX", email: CONTACT_EMAIL },
      to: [{ email: CONTACT_EMAIL }],
      subject,
      htmlContent,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo API Error:", data);
    throw {
      status: response.status,
      message: data.message || "Failed to send email",
    };
  }
}

/* ── Contact form handler ── */

async function handleContactSubmission(req, res) {
  const { name, email, phone, message, company }: ContactFormData = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    await triggerEmail(
      "New Contact Form Submission",
      generateContactEmailTemplate({ name, email, phone, message, company }),
    );
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

/* ── Project inquiry handler ── */

async function handleProjectInquiry(req, res) {
  const data: ProjectInquiryData = req.body;

  if (
    !data.name ||
    !data.email ||
    !data.services?.length ||
    !data.projectName
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    await triggerEmail(
      `New Project Inquiry — ${data.projectName} (${data.services.join(", ")})`,
      generateInquiryEmailTemplate(data),
    );
    return res
      .status(200)
      .json({ success: true, message: "Inquiry sent successfully!" });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    const status = error.status || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

/* ── Email templates ── */

const ACCENT = "#389494";

const generateContactEmailTemplate = (data: ContactFormData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
        .header { background-color: ${ACCENT}; color: white; padding: 24px; text-align: center; }
        .content { padding: 32px; background-color: #ffffff; }
        .footer { background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; }
        .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .data-table th { text-align: left; padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 30%; font-size: 14px; }
        .data-table td { padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500; font-size: 15px; }
        .message-box { background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-top: 15px; font-style: italic; border-left: 4px solid ${ACCENT}; }
        .badge { display: inline-block; background: #dbeafe; color: ${ACCENT}; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">New Inquiry</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">BuildX Contact Center</p>
        </div>
        <div class="content">
          <span class="badge">CONTACT FORM</span>
          <h2 style="margin-top: 0; color: #111827;">You have a new lead!</h2>
          <p>Details of the submission are provided below:</p>
          <table class="data-table">
            <tr><th>NAME</th><td>${data.name}</td></tr>
            <tr><th>COMPANY</th><td>${data.company || "N/A"}</td></tr>
            <tr><th>EMAIL</th><td><a href="mailto:${data.email}" style="color: ${ACCENT}; text-decoration: none;">${data.email}</a></td></tr>
            <tr><th>PHONE</th><td>${data.phone || "N/A"}</td></tr>
          </table>
          <h4 style="margin-bottom: 8px; color: #111827;">Message:</h4>
          <div class="message-box">"${data.message}"</div>
        </div>
        <div class="footer">
          <p>This email was sent from the <strong>BuildX</strong> automated contact system.</p>
        </div>
      </div>
    </body>
  </html>
`;

const generateInquiryEmailTemplate = (data: ProjectInquiryData) => {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
          <th style="text-align:left;padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;width:32%;font-size:13px;">${label}</th>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:500;font-size:14px;">${value}</td>
        </tr>`
      : "";

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;">
        <div style="max-width:620px;margin:20px auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background-color:${ACCENT};color:white;padding:24px;text-align:center;">
            <h1 style="margin:0;font-size:22px;">New Project Inquiry</h1>
            <p style="margin:6px 0 0;opacity:0.9;font-size:14px;">${data.projectName}</p>
          </div>
          <div style="padding:32px;background:#ffffff;">
            <span style="display:inline-block;background:#dbeafe;color:${ACCENT};padding:4px 12px;border-radius:99px;font-size:12px;font-weight:bold;margin-bottom:16px;">PROJECT INQUIRY</span>
            <h2 style="margin-top:0;color:#111827;font-size:18px;">You have a new project inquiry!</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:4px;">
              ${row("NAME", data.name)}
              ${row("EMAIL", `<a href="mailto:${data.email}" style="color:${ACCENT};text-decoration:none;">${data.email}</a>`)}
              ${row("PHONE", data.phone || "")}
              ${row("SERVICES", data.services.join(", "))}
              ${row("PROJECT", data.projectName)}
              ${row("HAS ASSETS", data.hasAssets || "")}
              ${row("BUDGET", data.budget ? `${data.budget} (${data.currency || "AED"})` : "")}
              ${row("START", data.startTimeline || "")}
              ${row("REFERRAL", data.referralSource || "")}
            </table>
            <h4 style="margin:24px 0 8px;color:#111827;">Project description:</h4>
            <div style="background:#f3f4f6;padding:20px;border-radius:6px;font-style:italic;border-left:4px solid ${ACCENT};">
              "${data.description}"
            </div>
          </div>
          <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
            <p style="margin:0;">This email was sent from the <strong>BuildX</strong> automated contact system.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
