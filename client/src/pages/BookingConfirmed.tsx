import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;
  const bookingReference = location.state?.bookingReference;

  // Use actual booking reference from backend or generate fallback
  const refId = bookingReference || (bookingId ? `HUF${bookingId.slice(-6).toUpperCase()}` : "HUF" + Math.random().toString(36).substring(2, 6).toUpperCase());

  return (
    <div className="flex flex-col items-center justify-start pt-20 h-[calc(100dvh-76px)] ">
      {/* Success Icon */}
      <div className="bg-green-500 text-white p-4 rounded-full mb-4">
        <CheckCircle size={40} />
      </div>

      {/* Confirmation Text */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed</h1>
      <p className="text-gray-600 mb-2">Thank you for your booking!</p>
      <p className="text-gray-600 mb-6">Ref ID: {refId}</p>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-yellow-400 text-black rounded-md hover:brightness-95 transition font-medium"
      >
        Back to Home
      </button>
    </div>
  );
};

export default BookingConfirmed;
