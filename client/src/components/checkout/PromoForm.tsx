import type { Dispatch, SetStateAction } from 'react';

type ValidatePromoFn = (payload: { code: string; totalAmount: number }) => Promise<any>;

type Props = {
  promo: string;
  setPromo: Dispatch<SetStateAction<string>>;
  appliedPromo: string | null;
  setAppliedPromo: Dispatch<SetStateAction<string | null>>;
  discountAmount: number;
  setDiscountAmount: Dispatch<SetStateAction<number>>;
  promoMessage: string | null;
  setPromoMessage: Dispatch<SetStateAction<string | null>>;
  validatePromo: ValidatePromoFn;
  subtotal: number;
};

const PromoForm = ({
  promo,
  setPromo,
  appliedPromo,
  setAppliedPromo,
  discountAmount,
  setDiscountAmount,
  promoMessage,
  setPromoMessage,
  validatePromo,
  subtotal,
}: Props) => {
  const applyPromo = async () => {
    const code = promo.trim().toUpperCase();
    if (!code) {
      setPromoMessage('Enter a promo code');
      return;
    }

    try {
      const response = await validatePromo({ code, totalAmount: subtotal });
      if (response.success) {
        setAppliedPromo(code);
        setDiscountAmount(response.data.discountAmount);
        setPromoMessage(`Applied ${code} - ₹${response.data.discountAmount} off`);
      }
    } catch (err) {
      setPromoMessage(err instanceof Error ? err.message : 'Invalid promo code');
      setAppliedPromo(null);
      setDiscountAmount(0);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromo('');
    setPromoMessage(null);
    setDiscountAmount(0);
  };

  return (
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

      {promoMessage && (
        <p className={`text-sm ${appliedPromo ? 'text-green-600' : 'text-red-600'}`}>{promoMessage}</p>
      )}
    </div>
  );
};

export default PromoForm;
