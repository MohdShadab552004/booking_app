import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExperience } from "../hooks/useExperiences";

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { experience, loading, error } = useExperience(id || "");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return <div className="max-w-7xl mx-auto mt-10">Loading...</div>;
  }

  if (error || !experience) {
    return <div className="max-w-7xl mx-auto mt-10">Error: {error}</div>;
  }

  // Format dates from slots
  const availableDates = [...new Set(experience.slots.map(slot => {
    const date = new Date(slot.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }))];

  // Get available time slots for selected date
  const availableTimeSlots = experience.slots
    .filter(slot => {
      const slotDate = new Date(slot.date);
      const formattedDate = slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return formattedDate === selectedDate;
    })
    .map(slot => ({
      id: slot._id,
      time: slot.startTime,
      left: slot.maxParticipants - slot.bookedParticipants,
      soldOut: !slot.isAvailable || slot.bookedParticipants >= slot.maxParticipants,
      originalSlot: slot // Keep original slot data for API
    }));

  const basePrice = experience.price;
  const tax = Math.round(basePrice * quantity * 0.06); // 6% tax
  const total = basePrice * quantity + tax;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot: any) => {
    if (!timeSlot.soldOut) {
      setSelectedTimeSlot(timeSlot);
    }
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both date and time slot");
      return;
    }
    
    // Find the original slot to get full date for backend
    const originalSlot = experience.slots.find(slot => slot._id === selectedTimeSlot.id);
    
    if (!originalSlot) {
      alert("Selected slot not found");
      return;
    }

    navigate('/checkout', {
      state: {
        experienceId: experience._id,
        slotId: selectedTimeSlot.id,
        experience: experience.title,
        date: selectedDate, // Display date
        backendDate: originalSlot.date, // Full date for backend
        time: selectedTimeSlot.time,
        basePrice: experience.price,
        quantity
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Image */}
        <div className="w-full h-[381px] rounded-xl overflow-hidden">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl font-medium">{experience.title}</h1>
          <p className="text-[16px] text-[#6C6C6C] mt-1">
            {experience.detailedDescription || experience.description}
          </p>
        </div>

        {/* Choose Date */}
        <div>
          <h2 className="text-lg font-medium mb-2">Choose date</h2>
          <div className="flex flex-wrap gap-3">
            {availableDates.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() => handleDateSelect(date)}
                className={`px-3 py-2 rounded-md text-sm ${
                  selectedDate === date
                    ? "bg-[#FFD643] text-[#161616]"
                    : "border-[0.6px] border-[#BDBDBD] text-[#838383]"
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Choose Time */}
        {selectedDate && (
          <div>
            <h2 className="text-md font-medium mb-2">Choose time</h2>
            <div className="flex flex-wrap gap-3">
              {availableTimeSlots.map((timeSlot) => (
                <button
                  key={timeSlot.id}
                  type="button"
                  onClick={() => handleTimeSlotSelect(timeSlot)}
                  disabled={timeSlot.soldOut}
                  className={`px-3 py-2 rounded-md text-sm ${
                    timeSlot.soldOut
                      ? "bg-[#CCCCCC] text-[#838383] cursor-not-allowed"
                      : selectedTimeSlot?.id === timeSlot.id
                      ? "bg-yellow-400 font-medium text-black"
                      : "border-[0.6px] border-[#BDBDBD] text-[#6A6A6A]"
                  }`}
                >
                  <span className="text-[14px]">{timeSlot.time} </span>
                  {timeSlot.soldOut ? (
                    <span className="text-[10px] ml-1 font-medium">Sold out</span>
                  ) : (
                    <span className="text-[10px] text-[#FF4C0A] ml-1 font-medium">
                      {timeSlot.left} left
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#838383] mt-2">
              All times are in IST (GMT +5:30)
            </p>
          </div>
        )}

        {/* About */}
        <div>
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="text-[12px] text-[#838383] bg-[#EEEEEE] px-3 py-2 rounded-sm">
            {experience.about || "Scenic routes, trained guides, and safety briefing."}
          </p>
        </div>
      </div>

      {/* Right Section (Booking Card) */}
      <div className="w-full h-fit bg-[#EFEFEF] rounded-xl p-5 flex flex-col gap-3">
        <div className="flex justify-between">
          <p className="text-[#656565]">Starts at</p>
          <p className="text-lg">₹{basePrice}</p>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[#656565]">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-6 h-6 border border-gray-400 flex items-center justify-center rounded hover:bg-gray-200"
            >
              <span className="-mt-[2px]">-</span>
            </button>
            <span className="font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-6 h-6 border border-gray-400 flex items-center justify-center rounded hover:bg-gray-200"
            >
              <span className="-mt-[2px]">+</span>
            </button>
          </div>
        </div>

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
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTimeSlot}
          className={`mt-2 py-3 rounded-lg font-medium transition ${
            !selectedDate || !selectedTimeSlot
              ? "bg-[#D7D7D7] text-[#7F7F7F] cursor-not-allowed"
              : "bg-yellow-400 text-black hover:brightness-95"
          }`}
        >
          Confirm
        </button>

        {/* Selection Status */}
        <div className="text-xs text-gray-500 mt-2">
          {!selectedDate && "Please select a date"}
          {selectedDate && !selectedTimeSlot && "Please select a time slot"}
          {selectedDate && selectedTimeSlot && "Ready to book!"}
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetail;