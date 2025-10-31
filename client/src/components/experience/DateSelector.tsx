type Props = {
  availableDates: string[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
};

const DateSelector = ({ availableDates, selectedDate, onSelect }: Props) => {
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Choose date</h2>
      <div className="flex flex-wrap gap-3">
        {availableDates.map((date) => (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`px-3 py-2 rounded-md text-sm ${
              selectedDate === date
                ? 'bg-[#FFD643] text-[#161616]'
                : 'border-[0.6px] border-[#BDBDBD] text-[#838383]'
            }`}
          >
            {date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
