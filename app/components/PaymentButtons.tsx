"use client";

import { supabase } from "../lib/supabase";

export default function PaymentButtons({ gameId }: { gameId: string }) {
  const markPaid = async () => {
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

    const { error } = await supabase.from("payments").upsert({
      game_id: gameId,
      profile_id: user.id,
      amount: 100,
      status: "paid",
    });

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    alert("Payment marked as Paid");
  };

  return (
    <button
      onClick={markPaid}
      className="bg-blue-600 px-6 py-3 rounded-lg"
    >
      Mark Paid
    </button>
  );
}