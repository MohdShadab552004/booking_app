import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";

import ContactForm from "../components/checkout/ContactForm";
import PromoForm from "../components/checkout/PromoForm";
import AgreementCheckbox from "../components/checkout/AgreementCheckbox";
import SummaryCard from "../components/checkout/SummaryCard";

const TAX_RATE = 0.06;

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking, validatePromo, loading, error } = useBooking();
  
  const bookingInfo = location.state as any;
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promo, setPromo] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = useMemo(
    () => bookingInfo.basePrice * Math.max(1, bookingInfo.quantity),
    [bookingInfo.basePrice, bookingInfo.quantity]
  );

  const taxes = Math.round((subtotal - discountAmount) * TAX_RATE);
  const total = subtotal - discountAmount + taxes;

  const handleConfirm = async () => {
    if (!agreed || !fullName || !email) return;

    try {
      const bookingData = {
        experienceId: bookingInfo.experienceId,
        slotId: bookingInfo.slotId,
        userInfo: {
          name: fullName,
          email: email,
        },
        participants: bookingInfo.quantity,
        promoCode: appliedPromo || undefined
      };

      const response = await createBooking(bookingData);
      
      if (response.success) {
        navigate('/complete', { 
          state: { bookingId: response.data._id }
        });
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Form (spans 2 columns on lg) */}
        <div className="lg:col-span-2 bg-gray-100 rounded-xl p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <ContactForm fullName={fullName} setFullName={setFullName} email={email} setEmail={setEmail} />

            <PromoForm
              promo={promo}
              setPromo={setPromo}
              appliedPromo={appliedPromo}
              setAppliedPromo={setAppliedPromo}
              discountAmount={discountAmount}
              setDiscountAmount={setDiscountAmount}
              promoMessage={promoMessage}
              setPromoMessage={setPromoMessage}
              validatePromo={validatePromo}
              subtotal={subtotal}
            />

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <AgreementCheckbox agreed={agreed} setAgreed={setAgreed} />
          </form>
        </div>

        {/* RIGHT: Summary Card */}
        <SummaryCard
          bookingInfo={bookingInfo}
          subtotal={subtotal}
          discountAmount={discountAmount}
          taxes={taxes}
          total={total}
          loading={loading}
          handleConfirm={handleConfirm}
          fullName={fullName}
          email={email}
          agreed={agreed}
        />
      </div>
    </div>
  );
}