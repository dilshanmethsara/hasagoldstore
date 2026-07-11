import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — HASA GOLD STORE" },
      { name: "description", content: "How HASA GOLD STORE collects, uses and protects your personal data. Compliant with Sri Lanka's PDPA 2022." },
    ],
  }),
  component: () => (
    <LegalLayout
      title="Privacy Policy"
      eyebrow="Legal"
      updated="June 1, 2026"
      current="/privacy"
      sections={[
        {
          id: "intro",
          title: "1. Introduction",
          body: (
            <>
              <p>HASA GOLD STORE Pvt Ltd ("HASA", "we", "our", "us") is a Sri Lankan company registered with the Registrar of Companies. We operate hasa.lk and the HASA GOLD STORE platform. This Privacy Policy explains what data we collect about you, why, and how we keep it safe.</p>
              <p>This policy is written in line with Sri Lanka's <strong className="text-foreground">Personal Data Protection Act No. 9 of 2022 (PDPA)</strong> and incorporates principles from the GDPR.</p>
            </>
          ),
        },
        {
          id: "data",
          title: "2. What information we collect",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li><strong className="text-foreground">Account data:</strong> name, email, phone number, profile photo, password (hashed).</li>
              <li><strong className="text-foreground">Gaming data:</strong> Player IDs and Server IDs you submit for top-up delivery.</li>
              <li><strong className="text-foreground">Payment data:</strong> billing details, card last 4 digits, transaction history. Full card numbers are never stored — they are tokenized by our certified payment gateways.</li>
              <li><strong className="text-foreground">Usage data:</strong> device type, browser, IP address, pages visited, referrer.</li>
            </ul>
          ),
        },
        {
          id: "use",
          title: "3. How we use your data",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>To process top-up orders and deliver them to the correct in-game account.</li>
              <li>To verify your identity, prevent fraud and comply with KYC obligations.</li>
              <li>To send transactional notifications via email, SMS and WhatsApp.</li>
              <li>To improve the product, debug issues and analyze trends (always aggregated).</li>
              <li>With your consent, to send promotions and personalised game recommendations.</li>
            </ul>
          ),
        },
        {
          id: "share",
          title: "4. Sharing with third parties",
          body: (
            <p>We share data only with vetted processors needed to run the service: payment gateways (PayHere, Stripe, Coinbase Commerce), game publishers (Garena, Tencent, Moonton), SMS/email providers (Twilio, Resend), and analytics (PostHog). We never sell your personal data.</p>
          ),
        },
        {
          id: "rights",
          title: "5. Your rights",
          body: (
            <>
              <p>Under Sri Lanka's PDPA you may:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Access and download a copy of your personal data.</li>
                <li>Correct or update inaccurate data.</li>
                <li>Request deletion ("right to be forgotten").</li>
                <li>Withdraw marketing consent at any time.</li>
                <li>Lodge a complaint with the Data Protection Authority of Sri Lanka.</li>
              </ul>
              <p>Submit requests to <span className="font-medium text-foreground">privacy@hasa.lk</span>. We respond within 14 days.</p>
            </>
          ),
        },
        {
          id: "security",
          title: "6. How we protect your data",
          body: (
            <p>All traffic is encrypted in transit (TLS 1.3) and at rest (AES-256). Passwords are hashed with Argon2id. We run quarterly penetration tests and our infrastructure is hosted in PCI-DSS compliant data centers.</p>
          ),
        },
        {
          id: "retention",
          title: "7. Data retention",
          body: <p>We retain account data while your account is active and for 7 years thereafter to comply with Sri Lankan tax law. You may request earlier deletion subject to outstanding obligations.</p>,
        },
        {
          id: "cookies",
          title: "8. Cookies",
          body: <p>We use strictly-necessary cookies for login and checkout, plus optional analytics cookies (PostHog). You can decline non-essential cookies in our cookie banner without losing functionality.</p>,
        },
        {
          id: "children",
          title: "9. Children",
          body: <p>HASA GOLD STORE is not intended for users under 13. If you believe a minor has signed up, contact privacy@hasa.lk and we will delete the account.</p>,
        },
        {
          id: "changes",
          title: "10. Changes to this policy",
          body: <p>We'll notify you of material changes via email and an in-app banner at least 14 days before they take effect.</p>,
        },
      ]}
    />
  ),
});