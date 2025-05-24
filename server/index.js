import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { google } from "googleapis";
import session from "express-session";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
console.log(
  "Google AI initialized with key prefix:",
  process.env.GOOGLE_AI_KEY?.substring(0, 4)
);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default port
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: "lax",
    },
    rolling: true, // Reset expiration on each request
  })
);

// Google OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/api/auth/google/callback"
);

// Add token refresh middleware
app.use(async (req, res, next) => {
  try {
    if (req.session?.tokens) {
      // Check if token will expire in the next 5 minutes
      const expiryTime = req.session.tokens.expiry_date;
      const fiveMinutes = 5 * 60 * 1000;

      if (expiryTime && expiryTime - Date.now() < fiveMinutes) {
        // Refresh the token
        oauth2Client.setCredentials(req.session.tokens);
        const { credentials } = await oauth2Client.refreshAccessToken();
        req.session.tokens = {
          ...credentials,
          // Keep the refresh token if we don't get a new one
          refresh_token:
            credentials.refresh_token || req.session.tokens.refresh_token,
        };
      }
    }
    next();
  } catch (error) {
    console.error("Token refresh error:", error);
    next();
  }
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Check auth status endpoint
app.get("/api/auth/status", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.json({
        isAuthenticated: false,
        email: null,
      });
    }

    // Check if token is about to expire (within 5 minutes)
    const expiryTime = req.session.tokens.expiry_date;
    const fiveMinutes = 5 * 60 * 1000;

    if (expiryTime && expiryTime - Date.now() < fiveMinutes) {
      // Refresh the token
      oauth2Client.setCredentials(req.session.tokens);
      const { credentials } = await oauth2Client.refreshAccessToken();
      req.session.tokens = {
        ...credentials,
        refresh_token:
          credentials.refresh_token || req.session.tokens.refresh_token,
      };
    }

    res.json({
      isAuthenticated: true,
      email: req.session.userEmail,
    });
  } catch (error) {
    console.error("Auth status check error:", error);
    // If we get an invalid_grant error, the refresh token is invalid
    if (error.message.includes("invalid_grant")) {
      req.session.destroy();
      return res.json({
        isAuthenticated: false,
        email: null,
      });
    }
    // For other errors, assume we're still authenticated if we have tokens
    res.json({
      isAuthenticated: !!req.session.tokens,
      email: req.session.userEmail,
    });
  }
});

// Google Calendar Auth Routes
app.get("/api/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    // Only prompt for consent if we don't have a refresh token
    prompt: req.session.tokens?.refresh_token ? undefined : "consent",
  });
  res.json({ url });
});

app.get("/api/auth/google/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user email
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Store tokens and user info in session
    // If we already have a refresh token, keep it unless we got a new one
    req.session.tokens = {
      ...tokens,
      refresh_token: tokens.refresh_token || req.session.tokens?.refresh_token,
    };
    req.session.userEmail = userInfo.data.email;

    res.redirect("http://localhost:5173/interview-prep");
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.status(500).json({ error: "Failed to get tokens" });
  }
});

// Logout endpoint
app.get("/api/auth/logout", (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Calendar API Routes
app.get("/api/calendar/upcoming", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Check if access token is expired
    if (req.session.tokens.expiry_date < Date.now()) {
      // Refresh the token
      oauth2Client.setCredentials(req.session.tokens);
      const { credentials } = await oauth2Client.refreshAccessToken();
      req.session.tokens = credentials;
      oauth2Client.setCredentials(credentials);
    } else {
      oauth2Client.setCredentials(req.session.tokens);
    }

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      q: "interview",
    });

    const interviews = response.data.items.map((event) => ({
      id: event.id,
      title: event.summary,
      datetime: event.start.dateTime || event.start.date,
      duration: event.end
        ? Math.round(
            (new Date(event.end.dateTime) - new Date(event.start.dateTime)) /
              (1000 * 60)
          )
        : 60,
      description: event.description || "",
      location: event.location || "",
    }));

    res.json(interviews);
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    if (error.message.includes("invalid_grant")) {
      // Token is invalid, clear session and ask for re-authentication
      req.session.destroy();
      return res
        .status(401)
        .json({ error: "Session expired, please re-authenticate" });
    }
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

// AI Recommendations endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    console.log("Starting AI recommendation generation...");
    const { meetings, format, requirements } = req.body;

    if (!meetings || !Array.isArray(meetings)) {
      return res.status(400).json({ error: "Invalid meetings data" });
    }

    if (!format || !requirements) {
      return res.status(400).json({ error: "Missing format or requirements" });
    }

    console.log("Processing meetings:", meetings.length);
    const meetingsContext = meetings
      .map((m) => `- ${m.title} (${new Date(m.datetime).toLocaleString()})`)
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Model initialized, generating content...");

    const prompt = `As an interview preparation assistant, analyze these upcoming interviews and provide structured preparation recommendations.

The response MUST follow this exact JSON format:
${JSON.stringify(format, null, 2)}

Requirements:
${requirements.map((req) => `- ${req}`).join("\n")}

Upcoming Interviews:
${meetingsContext}

Important: Response must be valid JSON matching the exact format shown above.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let recommendations;

    try {
      // Clean up the response text by removing markdown code block syntax
      const cleanText = response
        .text()
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      recommendations = JSON.parse(cleanText);

      // Validate the structure matches the provided format
      if (
        !recommendations.categories ||
        !Array.isArray(recommendations.categories)
      ) {
        throw new Error("Invalid recommendations structure");
      }

      // Add lastUpdated timestamp
      recommendations.lastUpdated = new Date().toISOString();
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Use the provided format for the fallback structure
      recommendations = {
        categories: [
          {
            id: "technical-prep",
            title: "Technical Preparation",
            description:
              "Focus on strengthening your technical skills relevant to software engineering roles.",
            tasks: [
              {
                id: "core-ds-algo",
                title: "Review core data structures and algorithms",
                isCompleted: false,
                subtasks: [
                  {
                    id: "basic-ds",
                    title:
                      "Arrays, linked lists, stacks, queues, and hash maps",
                    isCompleted: false,
                  },
                  {
                    id: "trees-graphs",
                    title: "Trees and graphs: BFS, DFS, Dijkstra's algorithm",
                    isCompleted: false,
                  },
                ],
              },
            ],
          },
        ],
        lastUpdated: new Date().toISOString(),
      };
    }

    res.json(recommendations);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: error.message,
    });
  }
});

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
