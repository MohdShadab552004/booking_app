import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBooking } from "../hooks/useBooking";

interface BookingInfo {
  experienceId: string;
  slotId: string;
  experience: string;
  date: string;
  time: string;
  basePrice: number;
  quantity: number;
}

const TAX_RATE = 0.06;

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking, validatePromo, loading, error } = useBooking();
  
  const bookingInfo = location.state as BookingInfo;
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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

  const applyPromo = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoMessage("Enter a promo code");
      return;
    }

    try {
      const response = await validatePromo({
        code,
        totalAmount: subtotal
      });

      if (response.success) {
        setAppliedPromo(code);
        setDiscountAmount(response.data.discountAmount);
        setPromoMessage(`Applied ${code} - ₹${response.data.discountAmount} off`);
      }
    } catch (err) {
      setPromoMessage(err instanceof Error ? err.message : "Invalid promo code");
      setAppliedPromo(null);
      setDiscountAmount(0);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromo("");
    setPromoMessage(null);
    setDiscountAmount(0);
  };

  const handleConfirm = async () => {
    if (!agreed || !fullName || !email) return;

    try {
      const bookingData = {
        experienceId: bookingInfo.experienceId,
        slotId: bookingInfo.slotId,
        userInfo: {
          name: fullName,
          email: email,
          phone: phone
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

  function formatINR(n: number) {
    return n.toLocaleString("en-IN", { style: "currency", currency: "INR" });
  }

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Full name</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  type="email"
                  className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-gray-600 mb-2">Phone (Optional)</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  type="tel"
                  className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </label>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600 mb-2">Promo code</span>
                  <input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter promo"
                    className="w-full rounded-md px-3 py-3 bg-white border border-gray-200 focus:outline-none"
                    disabled={!!appliedPromo}
                  />
                </label>
              </div>

              <div className="pt-6">
                {!appliedPromo ? (
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-3 py-2 bg-black text-white rounded-md text-sm font-medium hover:opacity-90 transition"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={removePromo}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {promoMessage && (
              <p
                className={`text-sm ${
                  appliedPromo ? "text-green-600" : "text-red-600"
                }`}
              >
                {promoMessage}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex items-center space-x-3 mt-1">
              <input
                id="agree"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
              />
              <label htmlFor="agree" className="text-sm text-gray-600">
                I agree to the terms and safety policy
              </label>
            </div>
          </form>
        </div>

        {/* RIGHT: Summary Card */}
        <aside className="w-full bg-white rounded-xl p-6 border shadow-sm">
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <div>Experience</div>
              <div className="font-medium text-gray-900">{bookingInfo.experience}</div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div>Date</div>
              <div className="font-medium text-gray-900">{bookingInfo.date}</div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div>Time</div>
              <div className="font-medium text-gray-900">{bookingInfo.time}</div>
            </div>

            <div className="flex justify-between text-sm text-gray-600 items-center">
              <div>Qty</div>
              <div className="flex items-center gap-2">
                <span>{bookingInfo.quantity}</span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div>Subtotal</div>
              <div className="font-medium">{formatINR(subtotal)}</div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div>Discount</div>
              <div className="font-medium text-green-600">
                {discountAmount > 0 ? `- ${formatINR(discountAmount)}` : formatINR(0)}
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <div>Taxes</div>
              <div className="font-medium">{formatINR(taxes)}</div>
            </div>

            <hr className="my-2 border-gray-200" />

            <div className="flex justify-between items-center">
              <div className="text-base font-semibold">Total</div>
              <div className="text-lg font-semibold">{formatINR(total)}</div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!agreed || !fullName || !email || loading}
              className={`w-full mt-2 py-3 rounded-md text-sm font-medium transition ${
                !agreed || !fullName || !email || loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-black hover:brightness-95"
              }`}
            >
              {loading ? "Processing..." : "Pay and Confirm"}
            </button>

            <p className="text-xs text-gray-400">
              By confirming you agree to our terms and payment policies.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}