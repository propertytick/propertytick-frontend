'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Save, Loader2, Building2, Briefcase, Scale, Star,
  Megaphone, TrendingUp, IndianRupee
} from 'lucide-react';
import api from '@/lib/api';
import Loader from '@/components/ui/Loader';

export default function AdminFeesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    brokerWelcomeFree: 3,
    brokerGrowthPackSize: 10,
    brokerGrowthPackPrice: 3000,
    brokerRegularPackSize: 10,
    brokerRegularPackPrice: 5000,
    advocateWelcomeFree: 3,
    advocatePackSize: 10,
    advocatePackPrice: 500,
    colonizerAdPackSize: 1000,
    colonizerAdPackPrice: 1000,
    colonizerGrowthPackSize: 5000,
    colonizerGrowthPackPrice: 5000,
    topRankingBroker: 999,
    topRankingAdvocate: 799,
    topRankingColonizer: 1499,
    topRankingBuyerProperty: 499,
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
        toast.error('Failed to load fees');
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
      const { data } = await api.patch('/admin/fees', form);
      if (data.success) {
        toast.success('Fees updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Fee Settings</h1>
          <p className="text-slate-600 mt-1">
            Configure pricing for all roles
          </p>
        </div>

        <div className="space-y-6">

          {/* ==================== BROKER ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-amber-500">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              Broker Pricing
            </h2>

            {/* Row 1: Welcome Free */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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

            {/* Row 2: Growth Pack (Size + Price together) */}
            <div className="mb-4 p-4 bg-amber-50 rounded-xl">
              <h3 className="text-sm font-bold text-amber-900 mb-3">
                Growth Pack
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size (deals)
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.brokerGrowthPackPrice}
                    onChange={(e) => update('brokerGrowthPackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-2 font-semibold">
                = ₹{form.brokerGrowthPackSize > 0 ? Math.round(form.brokerGrowthPackPrice / form.brokerGrowthPackSize) : 0} per deal
              </p>
            </div>

            {/* Row 3: Regular Pack (Size + Price together) */}
            <div className="p-4 bg-amber-50 rounded-xl">
              <h3 className="text-sm font-bold text-amber-900 mb-3">
                Regular Pack
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size (deals)
                  </label>
                  <input
                    type="number"
                    value={form.brokerRegularPackSize}
                    onChange={(e) => update('brokerRegularPackSize', e.target.value)}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.brokerRegularPackPrice}
                    onChange={(e) => update('brokerRegularPackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-amber-700 mt-2 font-semibold">
                = ₹{form.brokerRegularPackSize > 0 ? Math.round(form.brokerRegularPackPrice / form.brokerRegularPackSize) : 0} per deal
              </p>
            </div>
          </div>

          {/* ==================== ADVOCATE ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              Advocate Pricing
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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

            <div className="p-4 bg-purple-50 rounded-xl">
              <h3 className="text-sm font-bold text-purple-900 mb-3">
                Case Pack
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size (cases)
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.advocatePackPrice}
                    onChange={(e) => update('advocatePackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-purple-700 mt-2 font-semibold">
                = ₹{form.advocatePackSize > 0 ? Math.round(form.advocatePackPrice / form.advocatePackSize) : 0} per case
              </p>
            </div>
          </div>

          {/* ==================== COLONIZER ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              Colonizer Pricing
              <span className="ml-auto text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-semibold">
                No Free Tier
              </span>
            </h2>

            {/* Regular Pack */}
            <div className="mb-4 p-4 bg-red-50 rounded-xl">
              <h3 className="text-sm font-bold text-red-900 mb-3">
                Regular Advertisement Pack
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Price (₹)
                  </label>
                  <input
                    type="number"
                    value={form.colonizerAdPackPrice}
                    onChange={(e) => update('colonizerAdPackPrice', e.target.value)}
                    className="input-field"
                    min={0}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    ₹500 / ₹1000 / ₹5000 / ₹10000
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Pack */}
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="text-sm font-bold text-red-900 mb-3">
                Premium Growth Pack
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Size
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pack Price (₹)
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
          </div>

          {/* ==================== ADVERTISEMENT PRICING ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Advertisement Pricing (For Colonizers)
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
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
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
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
            </div>
          </div>

          {/* ==================== TOP RANKING ==================== */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Ranking Pricing (₹/month)
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Broker Top Ranking
                </label>
                <input
                  type="number"
                  value={form.topRankingBroker}
                  onChange={(e) => update('topRankingBroker', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Advocate Top Ranking
                </label>
                <input
                  type="number"
                  value={form.topRankingAdvocate}
                  onChange={(e) => update('topRankingAdvocate', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Colonizer Top Ranking
                </label>
                <input
                  type="number"
                  value={form.topRankingColonizer}
                  onChange={(e) => update('topRankingColonizer', e.target.value)}
                  className="input-field"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Buyer Property Top Ranking
                </label>
                <input
                  type="number"
                  value={form.topRankingBuyerProperty}
                  onChange={(e) => update('topRankingBuyerProperty', e.target.value)}
                  className="input-field"
                  min={0}
                />
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
                  Save All Fees
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
