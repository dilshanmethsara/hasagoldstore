import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — HASA GOLD STORE" },
      { name: "description", content: "Terms governing your use of HASA GOLD STORE, the Sri Lankan game top-up platform." },
    ],
  }),
  component: () => (
    <LegalLayout
      title="Terms of Service"
      eyebrow="Legal"
      updated="June 1, 2026"
      current="/terms"
      sections={[
        { id: "accept", title: "1. Acceptance of terms", body: (<p>By creating an account or placing an order on HASA GOLD STORE, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.</p>) },
        { id: "eligibility", title: "2. Eligibility", body: (<p>You must be at least 13 years old to use HASA GOLD STORE. If you are under 18 you must have parental consent for any paid transaction. By using the service you confirm the information you provide is accurate.</p>) },
        { id: "account", title: "3. Your account", body: (<>
          <p>You are responsible for keeping your login credentials secure. Notify us immediately at security@hasa.lk if you suspect unauthorised access.</p>
          <p>Each user is allowed one personal account. Creating multiple accounts to abuse promotional offers may result in suspension and forfeiture of wallet balance.</p>
        </>) },
        { id: "orders", title: "4. Orders and pricing", body: (<>
          <p>All prices are displayed in Sri Lankan Rupees (LKR) and include applicable taxes. Prices may change without notice but the price at checkout is the price you pay.</p>
          <p>You are responsible for providing the correct Player ID and Server ID. Orders delivered to a wrong but valid ID due to user error are non-refundable.</p>
        </>) },
        { id: "payment", title: "5. Payment", body: (<p>Payments are processed by licensed providers including PayHere (Sri Lanka), Stripe, and Coinbase Commerce. By paying you authorise HASA to charge your chosen method for the total shown at checkout.</p>) },
        { id: "wallet", title: "6. HASA Wallet", body: (<p>The HASA Wallet stores prepaid credit in LKR usable for top-ups. Wallet credit is non-transferable, non-refundable to bank once redeemed, and expires after 24 months of inactivity.</p>) },
        { id: "conduct", title: "7. Prohibited conduct", body: (<>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Use stolen payment instruments or commit fraud.</li>
            <li>Resell HASA top-ups commercially without a written reseller agreement.</li>
            <li>Reverse-engineer, scrape or attack the platform.</li>
            <li>Harass our support staff or other users.</li>
          </ul>
        </>) },
        { id: "ip", title: "8. Intellectual property", body: (<p>All HASA logos, designs, code and content are owned by HASA GOLD STORE Pvt Ltd. Game names and assets remain property of their respective publishers.</p>) },
        { id: "liability", title: "9. Limitation of liability", body: (<p>To the maximum extent permitted by Sri Lankan law, HASA's total liability for any claim relating to the service is capped at the amount you paid us in the 12 months before the claim.</p>) },
        { id: "termination", title: "10. Termination", body: (<p>We may suspend or terminate accounts that violate these terms. You may close your account at any time from Settings → Security.</p>) },
        { id: "law", title: "11. Governing law", body: (<p>These terms are governed by the laws of Sri Lanka. Any dispute is subject to the exclusive jurisdiction of the Commercial High Court of Colombo.</p>) },
        { id: "contact", title: "12. Contact", body: (<p>For legal notices: HASA GOLD STORE Pvt Ltd, Level 18, World Trade Center, Colombo 01 · legal@hasa.lk</p>) },
      ]}
    />
  ),
});