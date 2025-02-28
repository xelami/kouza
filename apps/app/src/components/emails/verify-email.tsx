export function verifyEmail(url: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <div style="margin: 0 auto; max-width: 600px; padding: 20px;">
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 32px; background-color: #ffffff;">
            <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 600; color: #1a202c;">
              Verify your email
            </h1>
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #4a5568;">
              Click the button below to verify your email address. If you didn't request this email, you can safely ignore it.
            </p>
            <div style="margin: 32px 0; text-align: center;">
              <a href="${url}" 
                 style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 500; font-size: 16px; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Verify Email
              </a>
            </div>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;" />
            <p style="margin: 0; font-size: 14px; color: #718096;">
              If the button above doesn't work, you can also click this link: 
              <a href="${url}" style="color: #2563eb; text-decoration: underline;">${url}</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `.trim()
}
