"use client";

import Link from "next/link";

export default function GcLookupPage() {
  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">GC lookup</p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">GC lookup is coming soon.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This feature is temporarily unavailable while we finish the verified appliance lookup experience.
        </p>
        <div className="mt-8">
          <Link href="/" className="inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}

/*
The previous interactive GC lookup implementation has been disabled temporarily.
It is preserved here for future development and can be restored when the feature is ready.

"use client";

import { FormEvent, useState } from "react";

type LookupResult = {
  manufacturer: string | null;
  exactModel: string | null;
  modelVariant: string | null;
  gcNumber: string | null;
  fuelType: string | null;
  installationManualUrl: string | null;
  sparePartsUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  dateVerified: string | null;
  generatedByAi: boolean;
  verifiedExactMatch: boolean;
  message: string;
};

const emptyResult: LookupResult = {
  manufacturer: null,
  exactModel: null,
  modelVariant: null,
  gcNumber: null,
  fuelType: null,
  installationManualUrl: null,
  sparePartsUrl: null,
  sourceName: null,
  sourceUrl: null,
  dateVerified: null,
  generatedByAi: false,
  verifiedExactMatch: false,
  message: "Enter a GC number to look up the boiler appliance details.",
};

export default function GcLookupPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<LookupResult>(emptyResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const integrationUnavailable = Boolean(result.unavailable);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gc-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gcNumber: input }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Lookup failed.");
      }

      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
      setResult(emptyResult);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">GC number lookup</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Verify a boiler appliance from its Gas Council number</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Enter a UK boiler Gas Council number to search for verified manufacturer and model details. The lookup runs on the server so no API credentials are exposed in the browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="gc-number">
            Boiler Gas Council number
          </label>
          <input
            id="gc-number"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="47-044-13"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-0 focus:border-blue-500"
          />
          <p className="mt-3 text-sm text-slate-500">Examples: 47-044-13, 4704413, GC 47 044 13</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={loading || integrationUnavailable}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Searching..." : "Look up appliance"}
            </button>
            {integrationUnavailable ? (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                Data source not connected
              </span>
            ) : null}
          </div>
        </form>

        {error ? <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

        {integrationUnavailable ? (
          <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Appliance data is currently unavailable. PlumbBud will not display a boiler model without a verified exact match.
          </p>
        ) : null}

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Results</h2>
            {result.verifiedExactMatch ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">Verified exact match</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">No verified exact match</span>
            )}
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">{result.message}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Manufacturer</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{result.manufacturer ?? "Not available"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Exact model</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{result.exactModel ?? "Not available"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Model variant</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{result.modelVariant ?? "Not available"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Fuel type</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{result.fuelType ?? "Not available"}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">GC number</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{result.gcNumber ?? "Not available"}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Installation / service manual</p>
              {result.installationManualUrl ? (
                <a href={result.installationManualUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-600 underline">
                  Open authorised manual
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No verified manual URL was returned.</p>
              )}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Spare-parts / exploded diagram</p>
              {result.sparePartsUrl ? (
                <a href={result.sparePartsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-600 underline">
                  Open authorised source
                </a>
              ) : (
                <p className="mt-2 text-sm text-slate-600">No authorised spare-parts or exploded-diagram link was available.</p>
              )}
            </div>
          </div>

          {result.sourceName || result.sourceUrl || result.dateVerified ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Source provenance</p>
              <p className="mt-2 text-sm text-slate-700">Source: {result.sourceName ?? "Not available"}</p>
              {result.sourceUrl ? (
                <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-600 underline">
                  Open source record
                </a>
              ) : null}
              {result.dateVerified ? <p className="mt-2 text-sm text-slate-600">Date verified: {result.dateVerified}</p> : null}
              <p className="mt-2 text-sm text-slate-600">Generated by AI: {result.generatedByAi ? "Yes" : "No"}</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
*/
