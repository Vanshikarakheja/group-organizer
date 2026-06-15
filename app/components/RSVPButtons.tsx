"use client";

import { supabase } from "../lib/supabase";

export default function RSVPButtons({ gameId }: { gameId: string }) {
  const saveRSVP = async (response: "yes" | "no" | "maybe") => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }
    await supabase.from("profiles").upsert({
  id: user.id,
  full_name:
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Unknown User",
});

    const { error } = await supabase.from("rsvps").upsert({
      game_id: gameId,
      profile_id: user.id,
      response,
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("RSVP saved: " + response);
  };

  return (
    <div className="flex gap-4">
      <button onClick={() => saveRSVP("yes")} className="bg-green-600 px-6 py-3 rounded-lg">
        Yes
      </button>

      <button onClick={() => saveRSVP("no")} className="bg-red-600 px-6 py-3 rounded-lg">
        No
      </button>

      <button onClick={() => saveRSVP("maybe")} className="bg-yellow-600 px-6 py-3 rounded-lg">
        Maybe
      </button>
    </div>
  );
}