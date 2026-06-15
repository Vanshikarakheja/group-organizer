"use client";
import Navbar from "../../../../components/Navbar";
import { useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function CreateGamePage() {
  const [title, setTitle] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const pathParts = window.location.pathname.split("/");
    const groupId = pathParts[2];

    const { error } = await supabase
      .from("games")
      .insert([
        {
          group_id: groupId,
          title,
          game_date: gameDate,
          venue,
          capacity: capacity ? Number(capacity) : null,
          cost_per_player: cost ? Number(cost) : null,
        },
      ]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Game created successfully!");

    setTitle("");
    setGameDate("");
    setVenue("");
    setCapacity("");
    setCost("");
  };

  return (
     <>
    <Navbar />
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Game
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
          placeholder="Game title"
        />

        <input
          value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
          type="datetime-local"
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
          type="number"
          placeholder="Capacity"
        />

        <input
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="w-full p-3 rounded bg-white text-black"
          type="number"
          placeholder="Cost per player"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-lg"
        >
          Create Game
        </button>
      </form>
    </main>
     </>
  );
}