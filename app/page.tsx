import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        Group Organizer
      </h1>

      <p className="text-gray-400 mb-8">
        Manage sports groups, RSVPs, payments and attendance.
      </p>

      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Login
        </Link>

        <Link
          href="/dashboard"
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}