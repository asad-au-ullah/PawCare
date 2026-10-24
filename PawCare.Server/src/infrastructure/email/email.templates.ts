export class EmailTemplates {
    static verificationEmail(
        email: string,
        verificationLink: string,
    ): string {
        return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Verify your PawCare account</title>
      </head>

      <body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f4f4f5;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0"
                     style="background:#ffffff;border-radius:12px;overflow:hidden;
                            max-width:600px;width:100%;">

                <!-- Header -->
                <tr>
                  <td style="background:#16a34a;padding:32px 40px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">
                      🐾 PawCare
                    </h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">
                      Verify your email address
                    </h2>

                    <p style="margin:0 0 8px;color:#6b7280;font-size:15px;line-height:1.6;">
                      Thanks for signing up! Click the button below to verify
                      <strong style="color:#111827;">${email}</strong>
                      and activate your account.
                    </p>

                    <p style="margin:0 0 32px;color:#6b7280;font-size:13px;">
                      This link expires in 24 hours.
                    </p>

                    <a href="${verificationLink}"
                       style="display:inline-block;background:#16a34a;color:#ffffff;
                              text-decoration:none;padding:14px 28px;border-radius:8px;
                              font-size:15px;font-weight:600;">
                      Verify Email Address
                    </a>

                    <p style="margin:32px 0 0;font-size:12px;color:#9ca3af;">
                      If you didn't create a PawCare account, you can safely ignore
                      this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb;padding:20px 40px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#9ca3af;">
                      © 2025 PawCare. All rights reserved.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    }
}
