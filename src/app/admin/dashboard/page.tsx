"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [contact, setContact] = useState("Admin Contact");
  const [email, setEmail] = useState("admin@example.com");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Example: send update request to your backend API
      const res = await fetch("/api/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, email }),
      });

      if (!res.ok) throw new Error("Failed to update admin info");

      alert("Saved successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Error saving data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    axios.get('/api/contact')
      .then(response => {
        const { contact_number, email } = response.data;
        setContact(contact_number);
        setEmail(email);
      })
      .catch(error => {
        console.error("Error fetching contact info:", error);
      });
  },[])

  return (
    <div className="space-y-6">
      {/* Editable Admin Section */}
      <div className="bg-white text-black rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Website Contact Settings</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 w-full rounded-sm p-2 px-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter contact name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-sm p-2 px-3 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter email address"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

    </div>
  );
}
