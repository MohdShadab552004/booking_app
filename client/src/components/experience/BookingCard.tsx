import type { Dispatch, SetStateAction } from 'react';
import QuantityPicker from './QuantityPicker';

type SlotRef = {
  id: string;
  time: string;
};

type Props = {
  basePrice: number;
  quantity: number;
  selectedDate: string | null;
  selectedTimeSlot: SlotRef | null;
  onConfirm: () => void;
  setQuantity: Dispatch<SetStateAction<number>>;
};

const BookingCard = ({ basePrice, quantity, selectedDate, selectedTimeSlot, onConfirm, setQuantity }: Props) => {
  const tax = Math.round(basePrice * quantity * 0.06);
  const total = basePrice * quantity + tax;

  const disabled = !selectedDate || !selectedTimeSlot;

  return (
    <div className="w-full h-fit bg-[#EFEFEF] rounded-xl p-5 flex flex-col gap-3">
      <div className="flex justify-between">
        <p className="text-[#656565]">Starts at</p>
        <p className="text-lg">₹{basePrice}</p>
      </div>

      <QuantityPicker quantity={quantity} setQuantity={setQuantity} />

      {selectedDate && (
        <div className="flex justify-between text-sm">
          <p className="text-[#656565]">Date</p>
          <p className="font-medium">{selectedDate}</p>
        </div>
      )}

      {selectedTimeSlot && (
        <div className="flex justify-between text-sm">
          <p className="text-[#656565]">Time</p>
          <p className="font-medium">{selectedTimeSlot.time}</p>
        </div>
      )}

      <div className="flex justify-between">
        <p className="text-[#656565]">Subtotal</p>
        <p>₹{basePrice * quantity}</p>
      </div>
      <div className="flex justify-between">
        <p className="text-[#656565]">Taxes</p>
        <p>₹{tax}</p>
      </div>

      <hr />

      <div className="flex justify-between font-semibold text-lg">
        <p className="">Total</p>
        <p>₹{total}</p>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={disabled}
        className={`mt-2 py-3 rounded-lg font-medium transition ${
          disabled ? 'bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed' : 'bg-yellow-400 text-black hover:brightness-95'
        }`}
      >
        Confirm
      </button>

      <div className="text-xs text-gray-500 mt-2">
        {!selectedDate && 'Please select a date'}
        {selectedDate && !selectedTimeSlot && 'Please select a time slot'}
        {selectedDate && selectedTimeSlot && 'Ready to book!'}
      </div>
    </div>
  );
};

export default BookingCard;
