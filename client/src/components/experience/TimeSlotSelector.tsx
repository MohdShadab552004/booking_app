type Slot = {
  id: string;
  time: string;
  left: number;
  soldOut: boolean;
};

type Props = {
  slots: Slot[];
  selectedTimeSlotId: string | null;
  onSelect: (slot: Slot) => void;
};

const TimeSlotSelector = ({ slots, selectedTimeSlotId, onSelect }: Props) => {
  return (
    <div>
      <h2 className="text-md font-medium mb-2">Choose time</h2>
      <div className="flex flex-wrap gap-3">
        {slots.map((timeSlot) => (
          <button
            key={timeSlot.id}
            type="button"
            onClick={() => onSelect(timeSlot)}
            disabled={timeSlot.soldOut}
            className={`px-3 py-2 rounded-md text-sm ${
              timeSlot.soldOut
                ? 'bg-[#CCCCCC] text-[#838383] cursor-not-allowed'
                : selectedTimeSlotId === timeSlot.id
                ? 'bg-yellow-400 font-medium text-black'
                : 'border-[0.6px] border-[#BDBDBD] text-[#6A6A6A]'
            }`}
          >
            <span className="text-[14px]">{timeSlot.time} </span>
            {timeSlot.soldOut ? (
              <span className="text-[10px] ml-1 font-medium">Sold out</span>
            ) : (
              <span className="text-[10px] text-[#FF4C0A] ml-1 font-medium">{timeSlot.left} left</span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#838383] mt-2">All times are in IST (GMT +5:30)</p>
    </div>
  );
};

export default TimeSlotSelector;
