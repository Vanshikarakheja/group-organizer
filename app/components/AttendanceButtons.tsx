"use client";

import { supabase } from "../lib/supabase";

export default function AttendanceButtons({ gameId }: { gameId: string }) {
  const markAttendance = async (attended: boolean) => {
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

    const { error } = await supabase.from("attendance").upsert({
      game_id: gameId,
      profile_id: user.id,
      attended,
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert(attended ? "Marked Present" : "Marked Absent");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => markAttendance(true)}
        className="bg-green-600 px-6 py-3 rounded-lg"
      >
        Present
      </button>

      <button
        onClick={() => markAttendance(false)}
        className="bg-red-600 px-6 py-3 rounded-lg"
      >
        Absent
      </button>
    </div>
  );
}