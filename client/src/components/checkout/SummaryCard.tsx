type BookingInfo = {
  experienceId: string;
  slotId: string;
  experience: string;
  date: string;
  time: string;
  basePrice: number;
  quantity: number;
};

type Props = {
  bookingInfo: BookingInfo;
  subtotal: number;
  discountAmount: number;
  taxes: number;
  total: number;
  loading: boolean;
  handleConfirm: () => Promise<void> | void;
  fullName: string;
  email: string;
  agreed: boolean;
};

function formatINR(n: number) {
  return n.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
}

const SummaryCard = ({ bookingInfo, subtotal, discountAmount, taxes, total, loading, handleConfirm, fullName, email, agreed }: Props) => {
  return (
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
          <div className="font-medium text-green-600">{discountAmount > 0 ? `- ${formatINR(discountAmount)}` : formatINR(0)}</div>
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
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-400 text-black hover:brightness-95'
          }`}
        >
          {loading ? 'Processing...' : 'Pay and Confirm'}
        </button>

        <p className="text-xs text-gray-400">By confirming you agree to our terms and payment policies.</p>
      </div>
    </aside>
  );
};

export default SummaryCard;
