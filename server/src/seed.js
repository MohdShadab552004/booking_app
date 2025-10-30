const mongoose = require('mongoose');
const Experience = require('./models/experience.model');
const PromoCode = require('./models/promoCode.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/booking_app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Sample data
const experiences = [
  {
    title: 'Kayaking Adventure',
    description: 'Experience the thrill of kayaking with expert guides. Perfect for beginners and intermediate paddlers.',
    image: 'https://images.unsplash.com/photo-1530866495561-e66de6cb2677?auto=format&fit=crop&w=800&q=60',
    price: 1999,
    duration: 3,
    location: 'Goa',
    category: 'Water Sports',
    rating: 4.8,
    reviewCount: 124,
    included: ['Equipment', 'Safety gear', 'Instructor', 'Photos'],
    requirements: ['Basic swimming ability', 'Comfortable in water'],
    slots: generateSlots(5)
  },
  {
    title: 'Mountain Trekking',
    description: 'Guided trek through scenic mountain trails. Stunning views and professional photography included.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=60',
    price: 2499,
    duration: 6,
    location: 'Manali',
    category: 'Trekking',
    rating: 4.9,
    reviewCount: 89,
    included: ['Guide', 'Snacks', 'First aid'],
    requirements: ['Good fitness level', 'Proper footwear'],
    slots: generateSlots(3)
  }
];

const promoCodes = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minAmount: 1000,
    maxDiscount: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minAmount: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

// Helper to generate future slots
function generateSlots(daysAhead) {
  const slots = [];
  const times = ['09:00', '11:00', '14:00'];
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    times.forEach(time => {
      const [hours, minutes] = time.split(':');
      const endTime = `${String(Number(hours) + 2).padStart(2, '0')}:${minutes}`;
      
      slots.push({
        date: new Date(date.setHours(Number(hours), Number(minutes))),
        startTime: time,
        endTime: endTime,
        maxParticipants: 8,
        bookedParticipants: 0,
        isAvailable: true
      });
    });
  }
  
  return slots;
}

// Seed data
async function seedData() {
  try {
    await connectDB();

    // Clear existing data
    await Experience.deleteMany({});
    await PromoCode.deleteMany({});

    // Insert new data
    await Experience.insertMany(experiences);
    await PromoCode.insertMany(promoCodes);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run seeder
seedData();