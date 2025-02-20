import React from 'react'

export default function TermsConditionsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      
      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using Kouza's services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">2. Subscription and Payments</h2>
          <p>Subscription fees are billed in advance on a monthly or annual basis. You agree to pay all fees associated with your subscription plan.</p>
          <div className="mt-4 space-y-2">
            <p><strong>Refund Policy:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Refund requests must be submitted within 14 days of purchase</li>
              <li>All refund requests will be evaluated on a case-by-case basis</li>
              <li>The final decision on refunds remains at Kouza's sole discretion</li>
              <li>Approved refunds will be processed within 5-10 business days</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Maintaining the confidentiality of your account</li>
            <li>All activities that occur under your account</li>
            <li>Ensuring your content doesn't violate any laws or rights</li>
            <li>Using the service in compliance with these terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are owned by Kouza and are protected by international copyright, trademark, and other intellectual property laws.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">5. Termination</h2>
          <p>We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
          <p>In no event shall Kouza, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">7. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>
          <p className="mt-2">Last updated: March 19, 2024</p>
        </section>
      </div>
    </div>
  )
}
