"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";

import { use } from "react";

export default function JoinGroupPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params); {
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("invite_token", token)
        .single();

      if (!error) {
        setGroup(data);
      }

      setLoading(false);
    };

    fetchGroup();
  }, [token]);

  const joinGroup = async () => {
    setJoining(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setJoining(false);
      return;
    }

    const { data: existingMembership } = await supabase
      .from("memberships")
      .select("*")
      .eq("group_id", group.id)
      .eq("profile_id", user.id)
      .single();

    if (existingMembership) {
      alert("You are already a member of this group");
      setJoining(false);
      return;
    }

    const { error } = await supabase.from("memberships").insert([
      {
        group_id: group.id,
        profile_id: user.id,
        role: "member",
        status: "pending",
      },
    ]);

    if (error) {
      alert(error.message);
      setJoining(false);
      return;
    }

    alert("Join request sent! Waiting for approval.");
    window.location.href = "/dashboard";
  };

  if (loading) {
    return <main className="p-8">Loading invite...</main>;
  }

  if (!group) {
    return <main className="p-8">Invalid invite link</main>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 text-white p-8">
        <div className="max-w-md mx-auto border border-slate-700 rounded-xl p-6">
          <h1 className="text-3xl font-bold mb-4">Join Group</h1>

          <p className="text-gray-300 mb-2">You have been invited to join:</p>

          <h2 className="text-2xl font-semibold mb-4">{group.name}</h2>

          <p className="text-gray-400 mb-6">
            Sport: {group.sport}
          </p>

          <button
            onClick={joinGroup}
            disabled={joining}
            className="w-full bg-blue-600 py-3 rounded-lg disabled:opacity-50"
          >
            {joining ? "Joining..." : "Join Group"}
          </button>
        </div>
      </main>
    </>
  );
}
}