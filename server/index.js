import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});

// Sample room data
const rooms = {
  standard: { price: 100, available: 5 },
  deluxe: { price: 200, available: 3 },
  suite: { price: 300, available: 2 },
  executive: { price: 400, available: 1 },
};

// Check room availability
app.post("/api/check-availability", (req, res) => {
  const { roomType, checkIn, checkOut } = req.body;

  // Simulate database check
  setTimeout(() => {
    const room = rooms[roomType];
    if (!room) {
      return res.status(404).json({ error: "Room type not found" });
    }

    const isAvailable = room.available > 0;
    res.json({
      available: isAvailable,
      price: room.price,
      remainingRooms: room.available,
    });
  }, 1000);
});

// Process booking
app.post("/api/book", (req, res) => {
  const { roomType, checkIn, checkOut } = req.body;

  // Simulate booking process
  setTimeout(() => {
    const room = rooms[roomType];
    if (!room) {
      return res.status(404).json({ error: "Room type not found" });
    }

    if (room.available <= 0) {
      return res.status(400).json({ error: "No rooms available" });
    }

    // Decrease available rooms
    room.available--;

    res.json({
      success: true,
      bookingId: Math.random().toString(36).substring(7),
      roomType,
      checkIn,
      checkOut,
      price: room.price,
    });
  }, 1500);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
