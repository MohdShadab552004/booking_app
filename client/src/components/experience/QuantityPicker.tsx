import type { Dispatch, SetStateAction } from 'react';

type Props = {
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
};

const QuantityPicker = ({ quantity, setQuantity }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-[#656565]">Quantity</p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-6 h-6 border border-gray-400 flex items-center justify-center rounded hover:bg-gray-200"
        >
          <span className="-mt-0.5">-</span>
        </button>
        <span className="font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="w-6 h-6 border border-gray-400 flex items-center justify-center rounded hover:bg-gray-200"
        >
          <span className="-mt-0.5">+</span>
        </button>
      </div>
    </div>
  );
};

export default QuantityPicker;
