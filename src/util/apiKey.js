// utils/apiKey.js
export async function fetchAndStoreApiKey() {
  try {
    const res = await fetch("/api/api-key");
    if (!res.ok) throw new Error("Failed to fetch API key");

    const data = await res.json();
    const apiKey = data.api_key;

    if (!apiKey) throw new Error("No API key found in response");

    // Store securely in localStorage
    localStorage.setItem("api_key", apiKey);

    // console.log("✅ API key stored in localStorage");
    return apiKey;
  } catch (err) {
    console.error("❌ Error fetching/storing API key:", err);
    return null;
  }
}
