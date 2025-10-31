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
    <>
      <div className="flex items-end gap-4 max-[500px]:flex-col">
        {/* Input Field */}
        <div className="flex-1 w-full">
          <label className="flex flex-col">
            <span className="text-sm text-gray-600 mb-2">Promo code</span>
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Enter promo"
              className="w-full py-3 px-4 bg-[#DDDDDD] rounded-md text-sm outline-none"
              disabled={!!appliedPromo}
            />
          </label>
        </div>

        {/* Apply / Remove Button */}
        {!appliedPromo ? (
          <button
            type="button"
            onClick={applyPromo}
            className="px-5 py-3 bg-black text-white rounded-md text-sm font-medium hover:opacity-90 transition max-[500px]:w-full"
          >
            Apply
          </button>
        ) : (
          <button
            type="button"
            onClick={removePromo}
            className="px-5 py-3 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition max-[500px]:w-full"
          >
            Remove
          </button>
        )}
      </div>

      {/* Promo message */}
      {promoMessage && (
        <p
          className={`text-sm mt-2 ${
            appliedPromo ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {promoMessage}
        </p>
      )}
    </>
  );
};

export default PromoForm;
