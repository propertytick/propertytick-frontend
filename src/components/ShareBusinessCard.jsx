'use client';

import { Share2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Role ke hisaab se header config
const ROLE_CONFIG = {
  advocate: {
    emoji: '⚖️',
    title: 'ADVOCATE',
    subtitle: 'Legal Professional',
    personEmoji: '👨‍⚖️',
    officeKey: 'chamber',       // office/chamber/shop
    officeLabel: '🏛️ OFFICE DETAILS',
    officeIcon: '🏛️',
  },
  typist: {
    emoji: '⌨️',
    title: 'TYPIST',
    subtitle: 'Document Specialist',
    personEmoji: '📝',
    officeKey: 'shop',
    officeLabel: '🏪 SHOP DETAILS',
    officeIcon: '🏪',
  },
  stamp_vendor: {
    emoji: '📜',
    title: 'STAMP VENDOR',
    subtitle: 'Authorized Dealer',
    personEmoji: '🏛️',
    officeKey: 'shop',
    officeLabel: '🏪 SHOP DETAILS',
    officeIcon: '🏪',
  },
  broker: {
    emoji: '🏠',
    title: 'PROPERTY DEALER',
    subtitle: 'Real Estate Expert',
    personEmoji: '👤',
    officeKey: 'shop',
    officeLabel: '🏪 OFFICE DETAILS',
    officeIcon: '🏪',
  },
  colonizer: {
    emoji: '🏗️',
    title: 'COLONIZER',
    subtitle: 'Colony Developer',
    personEmoji: '🏗️',
    officeKey: 'shop',
    officeLabel: '🏪 OFFICE DETAILS',
    officeIcon: '🏪',
  },
};

export default function ShareBusinessCard({ user }) {
  if (!user) return null;

  const config = ROLE_CONFIG[user.role] || ROLE_CONFIG.broker;

  // ==================== BUILD CARD MESSAGE ====================
  const buildCardMessage = () => {
    const dealerName = user.fullName || 'Professional';
    const dealerPhone = user.phone || '';
    const dealerWhatsApp = user.whatsapp || user.phone || '';
    const firmName = user.shopName || user.firmName || user.businessName || '';
    const businessHours = user.businessHours || '';
    const shopAddress = user.shopAddress || '';
    const shopLandmark = user.shopLandmark || '';
    const shopPincode = user.shopPincode || '';
    const licenseNumber = user.licenseNumber || ''; // Advocate/Stamp Vendor ke liye

    // Address block
    const shopFullAddress = [shopAddress, shopLandmark, shopPincode ? `- ${shopPincode}` : '']
      .filter(Boolean)
      .join('\n      ');

    // Google Maps link
    const coords = user.shopCoordinates?.coordinates;
    const hasCoords = Array.isArray(coords) && coords.length >= 2 && coords[0] !== 0 && coords[1] !== 0;

    const mapsUrl = hasCoords
      ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
      : shopAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopFullAddress)}`
      : '';

    // Build message
    const message = `╔══════════════════════╗
   ${config.emoji} *${config.title}*
   ✨ _${config.subtitle}_ ✨
╚══════════════════════╝

${config.personEmoji} *${dealerName}*${licenseNumber ? `\n📋 _License No: ${licenseNumber}_` : ''}${firmName ? `\n🏢 _${firmName}_` : ''}

╭─────────────────────╮
│ 👤 *PERSONAL INFO*   │
╰─────────────────────╯
   🙋 *Name:*     ${dealerName}
   📞 *Mobile:*   +91 ${dealerPhone}${dealerWhatsApp && dealerWhatsApp !== dealerPhone ? `\n   💬 *WhatsApp:* +91 ${dealerWhatsApp}` : ''}

${shopAddress || businessHours || firmName ? `╭─────────────────────╮
│ ${config.officeLabel} │
╰─────────────────────╯${firmName ? `\n   ${config.officeIcon} *Firm:*     ${firmName}` : ''}${shopAddress ? `\n   📍 ${shopFullAddress}` : ''}${businessHours ? `\n   🕐 *Timing:*    ${businessHours}` : ''}${mapsUrl ? `\n   🗺️ *Directions:*\n   ${mapsUrl}` : ''}` : ''}

━━━━━━━━━━━━━━━━━━━━
  ✨ _Listed on PropertyTick_
  🔒 _Verified & OTP-Secured_
  ⭐ _India's Trusted Platform_
━━━━━━━━━━━━━━━━━━━━`;

    return message;
  };

  // ==================== SHARE ON WHATSAPP ====================
  const handleWhatsAppShare = () => {
    const message = buildCardMessage();
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ==================== SHARE LINK ====================
  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.fullName} - ${config.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="space-y-2">
      {/* Share Business Card on WhatsApp */}
      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        Share Business Card on WhatsApp
      </button>

      {/* Share Profile Link */}
      <button
        type="button"
        onClick={handleShareLink}
        className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all"
      >
        <Share2 className="w-5 h-5" />
        Share Profile Link
      </button>
    </div>
  );
}
