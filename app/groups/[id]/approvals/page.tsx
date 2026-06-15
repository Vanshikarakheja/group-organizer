"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../../components/Navbar";

export default function ApprovalsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [isOrganizer, setIsOrganizer] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRequests() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login");
      setLoading(false);
      return;
    }

    const { data: membership } = await supabase
      .from("memberships")
      .select("role")
      .eq("group_id", id)
      .eq("profile_id", user.id)
      .single();
      console.log("USER ID:", user.id);
console.log("GROUP ID:", id);
console.log("MEMBERSHIP:", membership);

    if (!membership) {
  setIsOrganizer(false);
  setLoading(false);
  return;
}
    setIsOrganizer(true);

    const { data, error } = await supabase
      .from("memberships")
      .select(`
        id,
        role,
        status,
        profile_id,
        profiles (
          full_name,
          phone
        )
      `)
      .eq("group_id", id)
      .eq("status", "pending");

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setRequests(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function approveRequest(memberId: string) {
    const { error } = await supabase
      .from("memberships")
      .update({ status: "active" })
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    loadRequests();
  }

  async function rejectRequest(memberId: string) {
    const { error } = await supabase
      .from("memberships")
      .delete()
      .eq("id", memberId);

    if (error) {
      alert(error.message);
      return;
    }

    loadRequests();
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white p-8">
          <p className="text-gray-400">Loading...</p>
        </main>
      </>
    );
  }

  if (!isOrganizer) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-950 text-white p-8">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-gray-400 mt-2">
            Only organizers can view join requests.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Join Requests</h1>

        {requests.length === 0 && (
          <p className="text-gray-400">No pending requests</p>
        )}

        <div className="space-y-4">
          {requests.map((request: any) => (
            <div
              key={request.id}
              className="border border-slate-700 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">
                  {request.profiles?.full_name || "Unnamed User"}
                </h2>

                <p className="text-gray-400">
                  {request.profiles?.phone || "No phone"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approveRequest(request.id)}
                  className="bg-green-600 px-4 py-2 rounded-lg"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectRequest(request.id)}
                  className="bg-red-600 px-4 py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}