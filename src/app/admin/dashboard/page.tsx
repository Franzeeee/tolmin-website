"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function DashboardPage() {
  const [textData, setTextData] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMasked, setCurrentMasked] = useState<string | null>(null);

  // Mask helper: show only first 4 + last 2 chars
  const maskKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 6) return "*".repeat(key.length);
    return `${key.slice(0, 4)}${"*".repeat(Math.max(0, key.length - 6))}${key.slice(-2)}`;
  };

  // Load the latest saved API key (masked)
  useEffect(() => {
    axios
      .get("/api/api-key")
      .then((res) => {
        const key = res.data?.api_key ?? "";
        if (key) setCurrentMasked(maskKey(key));
      })
      .catch(() => {
        // no key found or error; keep quiet
        setCurrentMasked(null);
      });
  }, []);

  const handleUpload = async () => {
    const api_key = textData.trim();
    if (!api_key) {
      Swal.fire({
        title: "Prazno polje",
        text: "Prosimo, vnesite API ključ pred nalaganjem.",
        icon: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/api-key", { api_key });

      Swal.fire({
        title: "Uspeh",
        text: "API ključ je bil uspešno naložen ✅",
        icon: "success",
      });

      setCurrentMasked(maskKey(api_key));
      setTextData("");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Napaka",
        text: "API ključa ni bilo mogoče naložiti ❌",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white text-black rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Naloži API ključ tukaj
        </h1>
        {currentMasked && (
          <p className="text-sm text-gray-500 mb-4">
            Trenutno shranjen ključ: <span className="font-mono">{currentMasked}</span>
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Ključ
            </label>
            <textarea
              value={textData}
              onChange={(e) => setTextData(e.target.value)}
              className="mt-1 w-full h-32 rounded-sm p-2 px-3 border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 resize-none outline-none"
              placeholder="Type or paste your API key here..."
            ></textarea>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Nalaganje..." : "Naloži API ključ"}
          </button>
        </div>
      </div>
    </div>
  );
}
