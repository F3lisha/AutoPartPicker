// api/index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------
// Supabase client (HTTP on port 443)
// ------------------------------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Supabase URL:", SUPABASE_URL ? "Set" : "NOT set");
console.log("Supabase Anon Key:", SUPABASE_ANON_KEY ? "Set" : "NOT set");

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ------------------------------------
// Health check: also tests DB via HTTP
// ------------------------------------
app.get("/health", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("listing_id")
      .limit(1);

    if (error) {
      console.error("Supabase error in /health:", error);
      return res.status(500).json({
        status: "error",
        database: "error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Database error",
      });
    }

    res.json({
      status: "ok",
      database: "ok",
      rows: data?.length ?? 0,
    });
  } catch (err) {
    console.error("Unexpected error in /health:", err);
    res.status(500).json({
      status: "error",
      database: "error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Unexpected error",
    });
  }
});

// ------------------------------------
// GET /listings - fetch from Supabase
// ------------------------------------
app.get("/listings", async (req, res) => {
  console.log("Attempting to fetch listings via Supabase HTTP client...");
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("listing_id, title, price, status, source")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error in /listings:", error);
      return res.status(500).json({
        error: "Database error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Database error",
      });
    }

    console.log("Query successful, found", data.length, "listings");
    res.json(data);
  } catch (err) {
    console.error("Unexpected error in /listings:", err);
    res.status(500).json({
      error: "Unexpected error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Unexpected error",
    });
  }
});

// ------------------------------------
// TODO: add POST/PUT/DELETE routes later
// ------------------------------------

// Error middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    error: "Something broke!",
    details:
      process.env.NODE_ENV === "development" ? err.message : "Internal error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
