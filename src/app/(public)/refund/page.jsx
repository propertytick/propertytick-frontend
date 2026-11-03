export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Refund Policy</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">1. Charges</h2>
        <p>PropertyTick charges different fees for property dealers, rent dealers, property uploaders, and advocates. The charges are displayed at the time of listing or service purchase.</p>

        <h2 className="text-xl font-bold mt-6 mb-3">2. Refund Eligibility</h2>
        <p>You may request a refund within <strong>7 days</strong> of the charge, provided that:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You have <strong>not used any points</strong> (not even one) from the purchased package.</li>
          <li>The request is made within 7 days of the transaction.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">3. Non-Refundable Cases</h2>
        <p>Refunds will <strong>not</strong> be processed if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Any point from the purchased package has been used.</li>
          <li>The 7-day window has expired.</li>
        </ul>

        <h2 className="text-xl font-bold mt-6 mb-3">4. How to Request</h2>
        <p>To request a refund, email us at <strong>support@propertytick.com</strong> with your transaction details.</p>
      </div>
    </div>
  );
}