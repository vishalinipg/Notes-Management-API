const express = require("express");
require("dotenv").config();
const db = require("./models/db");

const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", notesRoutes);

app.get("/", (req, res) => {
    res.send("Notes Management API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});