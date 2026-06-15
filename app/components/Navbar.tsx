"use client";

import { supabase } from "../lib/supabase";

export default function Navbar() {
  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">
        Group Organizer
      </h1>

      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="text-white hover:text-blue-400"
        >
          Dashboard
        </a>

        <a
          href="/groups/new"
          className="text-white hover:text-blue-400"
        >
          Create Group
        </a>

        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}