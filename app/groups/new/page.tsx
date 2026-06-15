"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/Navbar";
export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [sport, setSport] = useState("");
  const [venue, setVenue] = useState("");

  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  alert("Button clicked");

  const {
  data: { user },
} = await supabase.auth.getUser();
const inviteToken = crypto.randomUUID();

if (!user) {
  alert("Please login first");
  return;
}


const { data: groupData, error: groupError } = await supabase
  .from("groups")
  .insert([
    {
      name,
      sport,
      venue,
      invite_token: inviteToken,
      created_by: user.id,
    },
  ])
  .select()
  .single();

if (groupError) {
  alert(groupError.message);
  return;
}

const { error: membershipError } = await supabase
  .from("memberships")
  .insert([
    {
      group_id: groupData.id,
      profile_id: user.id,
      role: "organizer",
      status: "active",
    }
  ]);

if (membershipError) {
  alert(membershipError.message);
  return;
}

alert("Group created successfully!");
}

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Group
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md space-y-4"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded border border-gray-400 bg-white text-black"
          placeholder="Group name"
        />

        <input
          value={sport}
          onChange={(e) => setSport(e.target.value)}
          className="w-full p-3 rounded border border-gray-400 bg-white text-black"
          placeholder="Sport"
        />

        <input
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full p-3 rounded border border-gray-400 bg-white text-black"
          placeholder="Venue"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-3 rounded-lg"
        >
          Create Group
        </button>
      </form>
    </main>
    </>
  );
}