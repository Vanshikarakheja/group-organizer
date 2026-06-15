import { supabase } from "../../lib/supabase";
import RSVPButtons from "../../components/RSVPButtons";
import AttendanceButtons from "../../components/AttendanceButtons";
import PaymentButtons from "../../components/PaymentButtons";
import Navbar from "../../components/Navbar";
export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: game, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();
    const { data: rsvps } = await supabase
  .from("rsvps")
  .select("response")
  .eq("game_id", id);

const { data: attendance } = await supabase
  .from("attendance")
  .select("attended")
  .eq("game_id", id);

const { data: payments } = await supabase
  .from("payments")
  .select("status")
  .eq("game_id", id);

const yesCount =
  rsvps?.filter((r) => r.response === "yes").length || 0;

const noCount =
  rsvps?.filter((r) => r.response === "no").length || 0;

const maybeCount =
  rsvps?.filter((r) => r.response === "maybe").length || 0;

const presentCount =
  attendance?.filter((a) => a.attended === true).length || 0;

const absentCount =
  attendance?.filter((a) => a.attended === false).length || 0;

const paidCount =
  payments?.filter((p) => p.status === "paid").length || 0;

  if (error || !game) {
    return (
      <main className="p-8">
        <h1>Game not found</h1>
      </main>
    );
  }

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold">{game.title}</h1>

      <div className="mt-6 space-y-2">
        <p><strong>Date:</strong> {new Date(game.game_date).toLocaleString()}</p>
        <p><strong>Venue:</strong> {game.venue}</p>
        <p><strong>Capacity:</strong> {game.capacity}</p>
        <p><strong>Cost:</strong> ₹{game.cost_per_player}</p>
      </div>

      
        <div className="mt-10">
  <h2 className="text-2xl font-semibold mb-4">
    RSVP
  </h2>

  <p className="mb-4">
    Yes: {yesCount} | No: {noCount} | Maybe: {maybeCount}
  </p>

  <RSVPButtons gameId={game.id} />
</div>

<div className="mt-10">
  <h2 className="text-2xl font-semibold mb-4">
    Attendance
  </h2>

  <p className="mb-4">
    Present: {presentCount} | Absent: {absentCount}
  </p>

  <AttendanceButtons gameId={game.id} />
</div>

<div className="mt-10">
  <h2 className="text-2xl font-semibold mb-4">
    Payment
  </h2>

  <p className="mb-4">
    Paid: {paidCount}
  </p>

  <PaymentButtons gameId={game.id} />
</div>
    </main>
  
    </>
    );
}