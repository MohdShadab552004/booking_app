import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExperience } from "../hooks/useExperiences";

import DateSelector from "../components/experience/DateSelector";
import TimeSlotSelector from "../components/experience/TimeSlotSelector";
import BookingCard from "../components/experience/BookingCard";
import BackHeader from "../components/common/BackHeader";

const ExperienceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { experience, loading, error } = useExperience(id || "");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    id: string;
    time: string;
    left: number;
    soldOut: boolean;
  } | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  if (loading) {
    return <div className="max-w-7xl mx-auto mt-10">Loading...</div>;
  }

  if (error || !experience) {
    return <div className="max-w-7xl mx-auto mt-10">Error: {error}</div>;
  }

  // Format dates from slots
  const availableDates = [...new Set(experience.slots.map((slot: any) => {
    const date = new Date(slot.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }))];

  // Get available time slots for selected date
  const availableTimeSlots = experience.slots
    .filter((slot: any) => {
      const slotDate = new Date(slot.date);
      const formattedDate = slotDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return formattedDate === selectedDate;
    })
    .map((slot: any) => ({
      id: slot._id,
      time: slot.startTime,
      left: slot.maxParticipants - slot.bookedParticipants,
      soldOut: !slot.isAvailable || slot.bookedParticipants >= slot.maxParticipants,
      originalSlot: slot // Keep original slot data for API
    }));

  const basePrice = experience.price;

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: any) => {
    if (!timeSlot.soldOut) setSelectedTimeSlot({ id: timeSlot.id, time: timeSlot.time, left: timeSlot.left, soldOut: timeSlot.soldOut });
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select both date and time slot");
      return;
    }

    const originalSlot = experience.slots.find((slot: any) => slot._id === selectedTimeSlot.id);
    if (!originalSlot) {
      alert("Selected slot not found");
      return;
    }

    navigate('/checkout', {
      state: {
        experienceId: experience._id,
        slotId: selectedTimeSlot.id,
        experience: experience.title,
        date: selectedDate,
        backendDate: originalSlot.date,
        time: selectedTimeSlot.time,
        basePrice: experience.price,
        quantity
      }
    });
  };

  return (
    <>
    <BackHeader title="Details"/>
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
      {/* Left Section */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="w-full h-[381px] rounded-xl overflow-hidden">
          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-medium">{experience.title}</h1>
          <p className="text-[16px] text-[#6C6C6C] mt-1">{experience.detailedDescription || experience.description}</p>
        </div>

        <DateSelector availableDates={availableDates} selectedDate={selectedDate} onSelect={handleDateSelect} />

        {selectedDate && (
          <TimeSlotSelector slots={availableTimeSlots} selectedTimeSlotId={selectedTimeSlot?.id ?? null} onSelect={handleTimeSlotSelect} />
        )}

        <div>
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="text-[12px] text-[#838383] bg-[#EEEEEE] px-3 py-2 rounded-sm">{experience.about || 'Scenic routes, trained guides, and safety briefing.'}</p>
        </div>
      </div>

      {/* Right Section (Booking Card) */}
      <BookingCard
        basePrice={basePrice}
        quantity={quantity}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        setQuantity={setQuantity}
        onConfirm={handleConfirm}
      />
    </div>
    </>
  );
};

export default ExperienceDetail;