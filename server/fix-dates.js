const { MongoClient } = require("mongodb");
require("dotenv").config();

async function fixInvalidDates() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log("📁 Connected to MongoDB");

    const db = client.db(process.env.MONGODB_DB_NAME);
    const collection = db.collection("posts");

    const currentDate = new Date();
    console.log("🔧 Starting to fix invalid dates...");

    // Update posts with null, empty, or invalid createdAt
    const result1 = await collection.updateMany(
      {
        $or: [
          { createdAt: null },
          { createdAt: { $exists: false } },
          { createdAt: "" },
          { createdAt: { $lt: new Date("1990-01-01") } }, // Before 1990 is likely invalid
        ],
      },
      {
        $set: {
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      }
    );

    // Update posts with null, empty, or invalid updatedAt
    const result2 = await collection.updateMany(
      {
        $or: [
          { updatedAt: null },
          { updatedAt: { $exists: false } },
          { updatedAt: "" },
          { updatedAt: { $lt: new Date("1990-01-01") } }, // Before 1990 is likely invalid
        ],
      },
      {
        $set: {
          updatedAt: currentDate,
        },
      }
    );

    console.log(
      `✅ Fixed ${result1.modifiedCount} posts with invalid createdAt`
    );
    console.log(
      `✅ Fixed ${result2.modifiedCount} posts with invalid updatedAt`
    );
    console.log("🎉 Database fix completed!");
  } catch (error) {
    console.error("❌ Error fixing dates:", error);
  } finally {
    await client.close();
    console.log("📁 Disconnected from MongoDB");
  }
}

// Run the fix
fixInvalidDates();
