"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, hasSupabaseConfig } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase || !hasSupabaseConfig()) {
      setLoading(false);
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }

      setUserEmail(data.session.user.email ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login");
      } else {
        setUserEmail(session.user.email ?? null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Dashboard</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Checking your session…</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Protected dashboard</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-3 text-slate-600">
          This view is protected by Supabase Auth. Your session is persisted in the browser and remains active after refreshes.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm font-medium text-slate-500">Signed in as</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{userEmail ?? "Your account"}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/chat" className="rounded-full bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
            Continue to chat
          </Link>
          <Link href="/" className="rounded-full border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100">
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
