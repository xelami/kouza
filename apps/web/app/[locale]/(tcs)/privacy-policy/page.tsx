import React from 'react'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Create an account</li>
            <li>Use our learning platform</li>
            <li>Contact our support team</li>
            <li>Subscribe to our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Storage and Security</h2>
          <p>We implement appropriate security measures to protect your personal information. Your data is stored securely using industry-standard encryption.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2">Email: privacy@kouza-ai.com</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          <p className="mt-2">Last updated: March 19, 2024</p>
        </section>
      </div>
    </div>
  )
}
