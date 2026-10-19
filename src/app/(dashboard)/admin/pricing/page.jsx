'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Save, Loader2, Building2, Briefcase, Scale, Star,
  Megaphone, TrendingUp, IndianRupee, Home
} from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    // Broker
    brokerWelcomeFree: 3,
    brokerGrowthPackSize: 10,
    brokerGrowthPackPrice: 3000,
    brokerRegularPackSize: 10,
    brokerRegularPackPrice: 5000,

    // Advocate
    advocateWelcomeFree: 3,
    advocatePackSize: 10,
    advocatePackPrice: 500,

    // Colonizer
    colonizerAdPackSize: 1000,
    colonizerAdPackPrice: 1000,
    colonizerGrowthPackSize: 5000,
    colonizerGrowthPackPrice: 5000,

    // Top Ranking
    topRankingBroker: 999,
    topRankingAdvocate: 799,
    topRankingColonizer: 1499,
    topRankingBuyerProperty: 499,

    // 👇 RENT PRICING — YEH ADD KARO
    rentFreeLimit: 3,
    rentPerPropertyPrice: 100,
    rentStarterPackSize: 10,
    rentStarterPackPrice: 1000,
    rentGrowthPackSize: 20,
    rentGrowthPackPrice: 3000,

    // Ad Pricing
    adPricing: {
      homepageBanner: 3000,
      searchTop: 1000,
      featuredBadge: 5000,
      homepageSpotlight: 5000,
	  
    },
  });

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const { data } = await api.get('/admin/fees');
        if (data.success) {
          setForm((f) => ({
            ...f,
            ...data.data.fees,
            adPricing: data.data.adPricing || f.adPricing,
          }));
        }
      } catch (err) {
        toast.error('Failed to load pricing');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, []);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: Number(v) }));
  const updateAd = (k, v) =>
    setForm((f) => ({ ...f, adPricing: { ...f.adPricing, [k]: Number(v) } }));

  const handleSave = async () => {
    setSaving(true);
    try {
		console.log("Save button clicked!", form);
      const { data } = await api.patch('/admin/fees', form);
      if (data.success) {
        toast.success('Pricing updated!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Pricing Management
          </h1>
          <p className="text-slate-600">
            Change pricing for Broker, Advocate, and Colonizer
          </p>
        </div>

        <div className="space-y-6">

          {/* BROKER */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              Broker Pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Welcome Free Deals
                </label>
                <input
                  type="number"
                  value={form.brokerWelcomeFree}
                  onChange={(e) => update('brokerWelcomeFree', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Kitni deals free (0 = koi free nahi)
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Growth Pack Size
                </label>
                <input
                  type="number"
                  value={form.brokerGrowthPackSize}
                  onChange={(e) => update('brokerGrowthPackSize', e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Growth Pack Price (₹)
                </label>
                <input
                  type="number"
                  value={form.brokerGrowthPackPrice}
                  onChange={(e) => update('brokerGrowthPackPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  ₹{Math.round(form.brokerGrowthPackPrice / form.brokerGrowthPackSize)}/deal
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Regular Pack Price (₹)
                </label>
                <input
                  type="number"
                  value={form.brokerRegularPackPrice}
                  onChange={(e) => update('brokerRegularPackPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  ₹{Math.round(form.brokerRegularPackPrice / form.brokerRegularPackSize)}/deal
                </p>
              </div>
            </div>
          </div>

          {/* ADVOCATE */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Advocate Pricing
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Welcome Free Cases
                </label>
                <input
                  type="number"
                  value={form.advocateWelcomeFree}
                  onChange={(e) => update('advocateWelcomeFree', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Pack Size
                </label>
                <input
                  type="number"
                  value={form.advocatePackSize}
                  onChange={(e) => update('advocatePackSize', e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Pack Price (₹)
                </label>
                <input
                  type="number"
                  value={form.advocatePackPrice}
                  onChange={(e) => update('advocatePackPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  ₹{Math.round(form.advocatePackPrice / form.advocatePackSize)}/case
                </p>
              </div>
            </div>
          </div>

          {/* COLONIZER */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              Colonizer Pricing
              <span className="ml-auto text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-semibold">
                No Free Tier
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Regular Pack Size
                </label>
                <input
                  type="number"
                  value={form.colonizerAdPackSize}
                  onChange={(e) => update('colonizerAdPackSize', e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Regular Pack Price (₹)
                </label>
                <input
                  type="number"
                  value={form.colonizerAdPackPrice}
                  onChange={(e) => update('colonizerAdPackPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Example: ₹500, ₹1000, ₹5000, ₹10000
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Growth Pack Size
                </label>
                <input
                  type="number"
                  value={form.colonizerGrowthPackSize}
                  onChange={(e) => update('colonizerGrowthPackSize', e.target.value)}
                  className="input-field"
                  min={1}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Growth Pack Price (₹)
                </label>
                <input
                  type="number"
                  value={form.colonizerGrowthPackPrice}
                  onChange={(e) => update('colonizerGrowthPackPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* ADVERTISEMENT PRICING */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Advertisement Pricing
              <span className="ml-auto text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">
                For Colonizers
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Homepage Banner (₹/day)
                </label>
                <input
                  type="number"
                  value={form.adPricing.homepageBanner}
                  onChange={(e) => updateAd('homepageBanner', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Search Top Priority (₹/day)
                </label>
                <input
                  type="number"
                  value={form.adPricing.searchTop}
                  onChange={(e) => updateAd('searchTop', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Featured Badge (₹/week)
                </label>
                <input
                  type="number"
                  value={form.adPricing.featuredBadge}
                  onChange={(e) => updateAd('featuredBadge', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Homepage Spotlight (₹/day)
                </label>
                <input
                  type="number"
                  value={form.adPricing.homepageSpotlight}
                  onChange={(e) => updateAd('homepageSpotlight', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* TOP RANKING */}
                    {/* RENT PRICING */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-teal-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-teal-600" />
              Rent Pricing
              <span className="ml-auto text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full font-semibold">
                New
              </span>
            </h2>

            {/* Free Limit + Per Property */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Free Properties Limit
                </label>
                <input
                  type="number"
                  value={form.rentFreeLimit}
                  onChange={(e) => update('rentFreeLimit', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Har user 3 property free list kar sakta hai
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Per Property Price (₹)
                </label>
                <input
                  type="number"
                  value={form.rentPerPropertyPrice}
                  onChange={(e) => update('rentPerPropertyPrice', e.target.value)}
                  className="input-field"
                  min={0}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Free limit ke baad har property ka charge
                </p>
              </div>
            </div>

            {/* Starter Pack */}
            <div className="bg-teal-50 rounded-xl p-4 mb-3">
              <h3 className="text-sm font-bold text-teal-700 mb-3">Starter Pack</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pack Size (points)
                  </label>
                  <input
                    type="number"
                    value={form.rentStarterPackSize}
                    onChange={(e) => update('rentStarterPackSize', e.target.value)}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.rentStarterPackPrice}
                    onChange={(e) => update('rentStarterPackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    ₹{Math.round(form.rentStarterPackPrice / form.rentStarterPackSize)}/point
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Pack */}
            <div className="bg-teal-50 rounded-xl p-4">
              <h3 className="text-sm font-bold text-teal-700 mb-3">Growth Pack</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pack Size (points)
                  </label>
                  <input
                    type="number"
                    value={form.rentGrowthPackSize}
                    onChange={(e) => update('rentGrowthPackSize', e.target.value)}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.rentGrowthPackPrice}
                    onChange={(e) => update('rentGrowthPackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    ₹{Math.round(form.rentGrowthPackPrice / form.rentGrowthPackSize)}/point
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SAVE */}
          <div className="sticky bottom-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save All Pricing
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
