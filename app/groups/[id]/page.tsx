import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: group, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("group_id", id)
    .order("game_date", { ascending: true });

  if (error || !group) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white p-8">
          <h1 className="text-3xl font-bold">Group not found</h1>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
        <section className="max-w-6xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <p className="text-blue-400 font-medium mb-2">Group</p>
            <h1 className="text-4xl md:text-5xl font-bold">{group.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Sport</p>
                <p className="text-lg font-semibold">{group.sport || "Not set"}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Venue</p>
                <p className="text-lg font-semibold">{group.venue || "Not set"}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Capacity</p>
                <p className="text-lg font-semibold">{group.capacity ?? "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
            <div className="flex flex-wrap gap-3">
              <a href={`/join/${group.invite_token}`} className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg">
                Invite Link
              </a>

              <a href={`/groups/${group.id}/members`} className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-lg">
                Members
              </a>

              <a href={`/groups/${group.id}/announcements`} className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-lg">
                Announcements
              </a>

              <a href={`/groups/${group.id}/approvals`} className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-lg">
                Approvals
              </a>

              <a href={`/groups/${group.id}/settings`} className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-lg">
                Settings
              </a>

              <a href={`/groups/${group.id}/games/new`} className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg">
                + Create Game
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold">Games</h2>
              <p className="text-slate-400">Upcoming and created games for this group.</p>
            </div>
          </div>

          {games?.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold mb-2">No games yet</h3>
              <p className="text-slate-400 mb-6">Create your first game for this group.</p>
              <a href={`/groups/${group.id}/games/new`} className="inline-block bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl">
                Create Game
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {games?.map((game) => (
              <a
                href={`/games/${game.id}`}
                key={game.id}
                className="block bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-1 transition"
              >
                <h3 className="text-2xl font-bold">{game.title}</h3>
                <p className="text-slate-400 mt-3">
                  {new Date(game.game_date).toLocaleString()}
                </p>
                <p className="text-slate-500 mt-1">{game.venue || "Venue not set"}</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}