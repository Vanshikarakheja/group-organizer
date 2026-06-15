"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import Navbar from "../../../components/Navbar";

export default function AnnouncementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAnnouncements() {
    setLoading(true);

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("group_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setAnnouncements(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function createAnnouncement(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please enter title and message");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required");
      return;
    }

    const { error } = await supabase
      .from("announcements")
      .insert([
        {
          group_id: id,
          title,
          message,
          created_by: user.id,
        },
      ]);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setMessage("");
    loadAnnouncements();
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white px-6 py-8">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-blue-400 font-medium mb-2">
              Group Updates
            </p>

            <h1 className="text-4xl md:text-5xl font-bold">
              Announcements
            </h1>

            <p className="text-slate-400 mt-2">
              Share important updates with all group members.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <form
              onSubmit={createAnnouncement}
              className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit"
            >
              <h2 className="text-2xl font-bold mb-4">
                New Announcement
              </h2>

              <div className="space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Announcement message"
                  rows={5}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />

                <button className="w-full bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl font-medium">
                  Post Announcement
                </button>
              </div>
            </form>

            <div className="lg:col-span-2 space-y-4">
              {loading && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                  <p className="text-slate-400">
                    Loading announcements...
                  </p>
                </div>
              )}

              {!loading && announcements.length === 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                  <div className="text-4xl mb-3">📢</div>
                  <h3 className="text-2xl font-semibold mb-2">
                    No announcements yet
                  </h3>
                  <p className="text-slate-400">
                    Create your first update for this group.
                  </p>
                </div>
              )}

              {!loading &&
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl">
                        📢
                      </div>

                      <div className="flex-1">
                        <h2 className="text-2xl font-bold">
                          {item.title}
                        </h2>

                        <p className="text-slate-300 mt-3 leading-relaxed">
                          {item.message}
                        </p>

                        <p className="text-sm text-slate-500 mt-4">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}