"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../../components/Navbar";

export default function MembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMembers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .eq("group_id", id);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setMembers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function promoteMember(memberId: string) {
    const { error } = await supabase
      .from("memberships")
      .update({
        role: "co_organizer",
      })
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
  }

  async function demoteMember(memberId: string) {
    const { error } = await supabase
      .from("memberships")
      .update({
        role: "member",
      })
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
  }

  async function removeMember(memberId: string) {
    const confirmed = confirm(
      "Remove this member from the group?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    loadMembers();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-blue-400 font-medium mb-2">
              Group Management
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Members
            </h1>

            <p className="text-slate-400 mt-2">
              Manage organizers and members of this group.
            </p>
          </div>

          {loading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <p className="text-slate-400">
                Loading members...
              </p>
            </div>
          )}

          {!loading && members.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-semibold mb-2">
                No members found
              </h3>

              <p className="text-slate-400">
                Invite people using your invite link.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-xl mb-4">
                      👤
                    </div>

                    <h2 className="font-bold text-lg break-all">
                      {member.profile_id}
                    </h2>

                    <p className="text-slate-400 mt-2">
                      Status: {member.status}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm capitalize ${
                      member.role === "organizer"
                        ? "bg-green-600/20 text-green-300"
                        : member.role === "co_organizer"
                        ? "bg-yellow-600/20 text-yellow-300"
                        : "bg-blue-600/20 text-blue-300"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {member.role === "member" && (
                    <button
                      onClick={() =>
                        promoteMember(member.id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg"
                    >
                      Promote
                    </button>
                  )}

                  {member.role ===
                    "co_organizer" && (
                    <button
                      onClick={() =>
                        demoteMember(member.id)
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 transition px-4 py-2 rounded-lg"
                    >
                      Demote
                    </button>
                  )}

                  {member.role !==
                    "organizer" && (
                    <button
                      onClick={() =>
                        removeMember(member.id)
                      }
                      className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}