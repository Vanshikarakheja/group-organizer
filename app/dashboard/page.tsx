"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

export default function DashboardPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: memberships } = await supabase
        .from("memberships")
        .select("group_id")
        .eq("profile_id", user.id);

      const groupIds = memberships?.map((m) => m.group_id) || [];

      if (groupIds.length === 0) {
        setGroups([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("groups")
        .select("*")
        .in("id", groupIds)
        .order("created_at", { ascending: false });

      setGroups(data || []);
      setLoading(false);
    }

    loadDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
        <section className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <p className="text-blue-400 font-medium mb-2">
                Welcome back
              </p>
              <h1 className="text-4xl md:text-5xl font-bold">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your groups, games, RSVPs and payments.
              </p>
            </div>

            <a
              href="/groups/new"
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl font-medium text-center"
            >
              + Create Group
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400">My Groups</p>
              <h2 className="text-4xl font-bold mt-2">
                {groups.length}
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400">Status</p>
              <h2 className="text-2xl font-bold mt-3 text-green-400">
                Active
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <p className="text-slate-400">Workspace</p>
              <h2 className="text-2xl font-bold mt-3">
                Group Organizer
              </h2>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-semibold">Your Groups</h2>
            <p className="text-slate-400">
              Open a group to manage games, members and payments.
            </p>
          </div>

          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-slate-400">
              Loading dashboard...
            </div>
          )}

          {!loading && groups.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold mb-2">
                No groups yet
              </h3>
              <p className="text-slate-400 mb-6">
                Create your first sports group and start organizing games.
              </p>
              <a
                href="/groups/new"
                className="inline-block bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl"
              >
                Create Group
              </a>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!loading &&
              groups.map((group) => (
                <a
                  href={`/groups/${group.id}`}
                  key={group.id}
                  className="block bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-1 transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {group.name}
                      </h3>
                      <p className="text-slate-400 mt-2">
                        {group.sport || "Sport not set"}
                      </p>
                      <p className="text-slate-500 mt-1">
                        {group.venue || "Venue not set"}
                      </p>
                    </div>

                    <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      Open
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </section>
      </main>
    </>
  );
}