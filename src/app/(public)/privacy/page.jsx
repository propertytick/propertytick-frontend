export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Information We Collect</h2>
        <p>We collect your name, email, mobile number, and property details when you register or list a property on PropertyTick.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. How We Use Your Data</h2>
        <p>Your data is used to connect buyers with sellers, verify your identity, and improve our services. We do not sell your personal data to third parties.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Cookies</h2>
        <p>We use cookies to keep you logged in and remember your preferences.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Contact Us</h2>
        <p>If you have any questions about this policy, email us at <strong>support@propertytick.com</strong>.</p>
      </div>
    </div>
  );
}