export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Disclaimer</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. General Information</h2>
        <p>The information on PropertyTick is provided for general informational purposes only. We do not guarantee the accuracy or completeness of any property listing.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. No Legal Advice</h2>
        <p>PropertyTick is not a law firm. Any legal services (like title verification) are provided by independent advocates, not by PropertyTick.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Third-Party Links</h2>
        <p>Our site may contain links to third-party websites. We are not responsible for their content or privacy practices.</p>
      </div>
    </div>
  );
}