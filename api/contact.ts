const BREVO_API_KEY = process.env.BREVO_API_KEY;
const CONTACT_EMAIL = process.env.VITE_CONTACT_EMAIL;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { name, email, phone, message, company } = req.body;

  // Basic Validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Prepare the email data per Brevo V3 specs
  const emailData = {
    sender: {
      name: "BuildX",
      email: CONTACT_EMAIL, // This must be a verified sender in Brevo dashboard
    },
    to: [
      {
        email: CONTACT_EMAIL, // The recipient of the contact form submissions
        // name: name,
      },
    ],
    subject: "New Contact Form Submission",
    htmlContent: generateEmailTemplate({
      name,
      email,
      phone,
      message,
      company,
    }),
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Brevo provides error details in data.code and data.message
      console.error("Brevo API Error:", data);
      return res.status(response.status).json({
        success: false,
        message: data.message || "Failed to send email",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
}

const generateEmailTemplate = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
}) => {
  const accentColor = "#389494"; // A clean "BuildX" blue

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
          .header { background-color: ${accentColor}; color: white; padding: 24px; text-align: center; }
          .content { padding: 32px; background-color: #ffffff; }
          .footer { background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #6b7280; }
          .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .data-table th { text-align: left; padding: 12px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; width: 30%; font-size: 14px; }
          .data-table td { padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-weight: 500; font-size: 15px; }
          .message-box { background-color: #f3f4f6; padding: 20px; border-radius: 6px; margin-top: 15px; font-style: italic; border-left: 4px solid ${accentColor}; }
          .badge { display: inline-block; background: #dbeafe; color: ${accentColor}; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
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
              <tr>
                <th>NAME</th>
                <td>${data.name}</td>
              </tr>
              <tr>
                <th>COMPANY</th>
                <td>${data.company || "N/A"}</td>
              </tr>
              <tr>
                <th>EMAIL</th>
                <td><a href="mailto:${
                  data.email
                }" style="color: ${accentColor}; text-decoration: none;">${
                  data.email
                }</a></td>
              </tr>
              <tr>
                <th>PHONE</th>
                <td>${data.phone || "N/A"}</td>
              </tr>
            </table>

            <h4 style="margin-bottom: 8px; color: #111827;">Message:</h4>
            <div class="message-box">
              "${data.message}"
            </div>
          </div>

          <div class="footer">
            <p>This email was sent from the <strong>BuildX</strong> automated contact system.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
