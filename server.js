import express from "express";
import users from "./routes/users.js";
import jobs from "./routes/jobs.js";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const port = 8000;

//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Cookie Parser
app.use(cookieParser());

// CORS Setup
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Connect to Mongo Database
connectDB();

//Routes
app.use("/users", users);
app.use("/jobs", jobs);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the JobBoard API!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => console.log("Server is running on port 8000"));
