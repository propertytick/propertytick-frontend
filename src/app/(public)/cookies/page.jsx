export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Cookie Policy</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device to help websites function properly.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. How We Use Cookies</h2>
        <p>We use cookies to keep you logged in, remember your preferences, and analyze site traffic.</p>
        <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Managing Cookies</h2>
        <p>You can disable cookies in your browser settings, but some features may not work properly.</p>
      </div>
    </div>
  );
}