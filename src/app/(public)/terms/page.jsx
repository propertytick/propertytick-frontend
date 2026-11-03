export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms of Service</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Acceptance of Terms</h2>
        <p>By using PropertyTick, you agree to these terms. If you do not agree, please do not use our platform.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. User Responsibilities</h2>
        <p>You must provide accurate information. Listing fake properties or misusing the platform will result in account termination.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Charges and Points</h2>
        <p>Different charges apply for property dealers, rent dealers, advocates, and normal users. Points purchased are non-transferable and subject to our refund policy.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Limitation of Liability</h2>
        <p>PropertyTick is not responsible for any disputes between buyers and sellers. We act as a connecting platform only.</p>
      </div>
    </div>
  );
}