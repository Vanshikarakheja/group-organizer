"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const saveUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            "Unknown User",
        });

        router.push("/dashboard");
      }
    };

    saveUser();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </main>
  );
}