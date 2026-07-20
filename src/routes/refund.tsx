import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/site/LegalLayout";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — HASA GOLD STORE" },
      { name: "description", content: "Our 100% refund guarantee on failed top-ups. How and when refunds are processed in LKR." },
    ],
  }),
  component: () => (
    <LegalLayout
      title="Refund Policy"
      eyebrow="Legal"
      updated="June 1, 2026"
      current="/refund"
      sections={[
        { id: "promise", title: "Our refund promise", body: (
          <p>If your order fails through no fault of your own, we refund <strong className="text-foreground">100% of what you paid</strong>. No paperwork, no runaround. Refunds are issued in Sri Lankan Rupees to your original payment method.</p>
        ) },
        { id: "eligible", title: "When you're eligible for a refund", body: (
          <ul className="list-disc space-y-2 pl-5">
            <li>Top-up not delivered within 24 hours of payment confirmation.</li>
            <li>Duplicate charge for the same order.</li>
            <li>Payment captured but order shown as failed in your dashboard.</li>
            <li>Verified service outage during checkout.</li>
          </ul>
        ) },
        { id: "not-eligible", title: "When refunds are not available", body: (<>
          <p>To keep prices low and abuse out, we cannot refund in these cases:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Wrong Player ID or Server ID submitted by you (verify before paying).</li>
            <li>In-game items already credited and consumed.</li>
            <li>Account bans or restrictions imposed by the game publisher.</li>
            <li>Change of mind after successful delivery.</li>
          </ul>
        </>) },
        { id: "timeline", title: "Refund processing time", body: (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.04] text-foreground">
                <tr><th className="px-4 py-3 text-left font-semibold">Payment method</th><th className="px-4 py-3 text-left font-semibold">Processed within</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr><td className="px-4 py-3 font-medium text-foreground">HASA Wallet</td><td className="px-4 py-3">Instant</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">Dialog eZ Cash / Mobitel mCash</td><td className="px-4 py-3">1 business day</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">FriMi / Sampath Vishwa</td><td className="px-4 py-3">2 business days</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">Visa / Mastercard</td><td className="px-4 py-3">5–10 business days</td></tr>
                <tr><td className="px-4 py-3 font-medium text-foreground">Crypto (BTC, USDT)</td><td className="px-4 py-3">Within 24 hours</td></tr>
              </tbody>
            </table>
          </div>
        ) },
        { id: "how", title: "How to request a refund", body: (
          <ol className="list-decimal space-y-2 pl-5">
            <li>Open the failed order from your <strong className="text-foreground">Dashboard → Orders</strong>.</li>
            <li>Tap "Request refund" and select a reason.</li>
            <li>Our team reviews within 2 hours and confirms via email & WhatsApp.</li>
            <li>Funds are returned to your original payment method per the timeline above.</li>
          </ol>
        ) },
        { id: "disputes", title: "Chargebacks & disputes", body: (
          <p>If you're unsatisfied with a refund decision, contact <strong className="text-foreground">disputes@hasa.lk</strong>. We participate in good faith with bank chargeback processes but reserve the right to provide evidence of legitimate delivery.</p>
        ) },
      ]}
    />
  ),
});