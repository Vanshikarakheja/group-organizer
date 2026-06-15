"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../../components/Navbar";

export default function GroupSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroup() {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert(error.message);
        return;
      }

      setName(data.name || "");
      setSport(data.sport || "");
      setVenue(data.venue || "");
      setCapacity(data.capacity?.toString() || "");
      setLoading(false);
    }

    loadGroup();
  }, [id]);

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { error } = await supabase
      .from("groups")
      .update({
        name,
        sport,
        venue,
        capacity: capacity ? Number(capacity) : null,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings saved successfully");
  }

  if (loading) {
    return <main className="p-8">Loading settings...</main>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Group Settings</h1>

        <form onSubmit={saveSettings} className="max-w-md space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Group name"
          />

          <input
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Sport"
          />

          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Venue"
          />

          <input
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-3 rounded bg-white text-black"
            placeholder="Capacity"
            type="number"
          />

          <button className="w-full bg-blue-600 py-3 rounded-lg">
            Save Settings
          </button>
        </form>
      </main>
    </>
  );
}