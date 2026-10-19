'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';
import api from '@/lib/api'; 

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // 👈 Backend ko data bhejein
    const { data } = await api.post('/contact', form); 
    
    if (data.success) {
      toast.success('Message sent! We will get back to you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Something went wrong');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white">

      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 py-16 md:py-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <MessageCircle className="w-3.5 h-3.5 text-blue-300" />
            <span className="text-xs font-semibold text-white">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="text-base text-slate-300 max-w-xl mx-auto">
            Have questions? We'd love to hear from you. Our team typically responds within 24 hours.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-5 gap-6">

          {/* Contact Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-1">Email</p>
              <a href="mailto:info.propertytick@gmail.com" className="text-sm font-bold text-slate-900 hover:underline">
                info.propertytick@gmail.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-100/50 border border-emerald-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide mb-1">Phone</p>
              <a href="tel:+919999999999" className="text-sm font-bold text-slate-900 hover:underline">
                +91 99999 99999
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-100/50 border border-amber-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-3 shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">Office</p>
              <p className="text-sm font-bold text-slate-900">
                New Delhi, India
              </p>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-purple-100/50 border border-violet-200 rounded-xl p-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-violet-700 font-semibold uppercase tracking-wide mb-1">Support Hours</p>
              <p className="text-sm font-bold text-slate-900">
                Mon - Sat, 9 AM - 8 PM
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-5">Send us a message</h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      required
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="input-field text-sm"
                      maxLength={10}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => update('subject', e.target.value)}
                    required
                    className="input-field text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
<option value="Technical Support">Technical Support</option>
<option value="Property Listing Help">Property Listing Help</option>
<option value="KYC Verification">KYC Verification</option>
<option value="Payment Issue">Payment Issue</option>
<option value="Business Partnership">Business Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us how we can help..."
                    required
                    rows={5}
                    className="input-field text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
