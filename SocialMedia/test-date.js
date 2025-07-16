// Test script untuk memastikan tanggal sudah benar
// Jalankan dengan: node test-date.js

const now = new Date();
console.log("Current date:", now);
console.log("ISO String:", now.toISOString());
console.log(
  "Formatted:",
  now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
);

// Test parsing
const testDate = now.toISOString();
console.log("\nTesting date parsing:");
console.log("Original ISO:", testDate);
console.log("Parsed with new Date():", new Date(testDate));
console.log(
  "Formatted parsed:",
  new Date(testDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
);

// Test the wrong way (what was causing the bug)
console.log("\nTesting wrong way (parseInt):");
console.log("parseInt(testDate):", parseInt(testDate));
console.log("new Date(parseInt(testDate)):", new Date(parseInt(testDate)));
console.log(
  "Formatted wrong way:",
  new Date(parseInt(testDate)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
);
