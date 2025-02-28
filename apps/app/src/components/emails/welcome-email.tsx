export function welcomeEmail(name: string) {
  const year = new Date().getFullYear()

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
          <!-- Main Container -->
          <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 48px 32px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 32px;">
              <img src="https://kouza-ai.com/logo.png" alt="Kouza AI Logo" style="height: 40px; width: auto;" />
            </div>

            <!-- Welcome Message -->
            <h1 style="margin: 0 0 16px; font-size: 30px; font-weight: 800; color: #111827; text-align: center;">
              Welcome to Kouza AI, ${name}! 🎉
            </h1>

            <!-- Subtitle -->
            <p style="margin: 0 0 32px; font-size: 18px; line-height: 28px; color: #4b5563; text-align: center;">
              We're thrilled to have you on board. Let's get you started!
            </p>

            <!-- Feature Grid -->
            <div style="margin: 32px 0; display: grid; grid-template-columns: 1fr;">
              <!-- Feature 1 -->
              <div style="padding: 24px; margin-bottom: 16px; background-color: #f8fafc; border-radius: 8px;">
                <h3 style="margin: 0 0 8px; color: #1a202c; font-size: 18px; font-weight: 600;">
                  🚀 Next Steps
                </h3>
                <ul style="margin: 0; padding-left: 24px; color: #4a5568; font-size: 16px; line-height: 24px;">
                  <li style="margin-bottom: 8px;">Complete your profile</li>
                  <li style="margin-bottom: 8px;">Explore our AI features</li>
                  <li style="margin-bottom: 8px;">Join our community</li>
                </ul>
              </div>

              <!-- Feature 2 -->
              <div style="padding: 24px; background-color: #f8fafc; border-radius: 8px;">
                <h3 style="margin: 0 0 8px; color: #1a202c; font-size: 18px; font-weight: 600;">
                  💡 Need Help?
                </h3>
                <p style="margin: 0; color: #4a5568; font-size: 16px; line-height: 24px;">
                  Check out our <a href="https://kouza-ai.com/docs" style="color: #2563eb; text-decoration: none;">documentation</a> or reach out to our <a href="mailto:contact@xelami.com" style="color: #2563eb; text-decoration: none;">support team</a>.
                </p>
              </div>
            </div>

            <!-- Social Links -->
            <div style="margin-top: 40px; text-align: center;">
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px;">Follow us on social media:</p>
              <div>
                <a href="https://twitter.com/kouzaai" style="text-decoration: none; margin: 0 8px;">
                  <img src="https://kouza-ai.com/social/twitter.png" alt="Twitter" style="height: 24px; width: 24px;" />
                </a>
                <a href="https://linkedin.com/company/kouzaai" style="text-decoration: none; margin: 0 8px;">
                  <img src="https://kouza-ai.com/social/linkedin.png" alt="LinkedIn" style="height: 24px; width: 24px;" />
                </a>
                <a href="https://github.com/kouzaai" style="text-decoration: none; margin: 0 8px;">
                  <img src="https://kouza-ai.com/social/github.png" alt="GitHub" style="height: 24px; width: 24px;" />
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 14px;">
                © ${year} Xelami LTD. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 12px;">
                If you didn't create an account with us, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `.trim()
}
