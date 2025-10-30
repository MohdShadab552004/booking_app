export interface Experience {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  location: string;
  category: string;
  rating: number;
  reviewCount: number;
  duration: number;
  included: string[];
  requirements: string[];
  slots: Slot[];
  detailedDescription?: string;
  about?: string;
}

export interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  bookedParticipants: number;
  isAvailable: boolean;
}

export interface BookingData {
  experienceId: string;
  slotId: string;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  participants: number;
  promoCode?: string;
}

export interface PromoValidation {
  code: string;
  totalAmount: number;
}

export interface BookingResponse {
  _id: string;
  experienceId: Experience;
  slotId: string;
  userInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  participants: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  promoCode?: string;
  status: string;
  createdAt: string;
}