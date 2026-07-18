import { normalizeGcNumber } from "@/lib/gc-lookup/normalize";

export type LookupResult = {
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
  unavailable?: boolean;
  statusCode?: number;
};

type ApplianceRecord = {
  gc_number?: string | null;
  normalised_gc_number?: string | null;
  manufacturer?: string | null;
  model?: string | null;
  exact_variant?: string | null;
  fuel_type?: string | null;
  source_name?: string | null;
  source_url?: string | null;
  date_verified?: string | null;
  generated_by_ai?: boolean | null;
  verified?: boolean | null;
};

const API_BASE_URL = process.env.GC_LOOKUP_API_BASE_URL;
const API_TOKEN = process.env.GC_LOOKUP_API_TOKEN;

export async function lookupBoilerByGcNumber(rawInput: string): Promise<LookupResult> {
  const normalized = normalizeGcNumber(rawInput);

  if (!normalized) {
    return {
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
      unavailable: true,
      statusCode: 503,
      message: "GC lookup is not yet connected to a verified appliance database.",
    };
  }

  if (!API_BASE_URL || !API_TOKEN) {
    console.warn("GC lookup configuration missing: appliance API base URL and token are required.");

    return {
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
      unavailable: true,
      statusCode: 503,
      message: "GC lookup is not yet connected to a verified appliance database.",
    };
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/appliances?normalised_gc_number=${encodeURIComponent(normalized)}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return {
      manufacturer: null,
      exactModel: null,
      modelVariant: null,
      gcNumber: normalized,
      fuelType: null,
      installationManualUrl: null,
      sparePartsUrl: null,
      sourceName: null,
      sourceUrl: null,
      dateVerified: null,
      generatedByAi: false,
      verifiedExactMatch: false,
      unavailable: true,
      statusCode: 503,
      message: "GC lookup is not yet connected to a verified appliance database.",
    };
  }

  const payload = await response.json();
  const records = Array.isArray(payload?.records) ? payload.records : [];
  const appliance = records.find((record: ApplianceRecord) => {
    const candidate = record.normalised_gc_number ?? record.gc_number ?? null;
    return Boolean(candidate && candidate.toUpperCase() === normalized);
  });

  if (!appliance || !appliance.verified || !appliance.source_name || !appliance.source_url) {
    return {
      manufacturer: null,
      exactModel: null,
      modelVariant: null,
      gcNumber: normalized,
      fuelType: null,
      installationManualUrl: null,
      sparePartsUrl: null,
      sourceName: null,
      sourceUrl: null,
      dateVerified: null,
      generatedByAi: false,
      verifiedExactMatch: false,
      unavailable: true,
      statusCode: 503,
      message: "GC lookup is not yet connected to a verified appliance database.",
    };
  }

  return {
    manufacturer: appliance.manufacturer ?? null,
    exactModel: appliance.model ?? null,
    modelVariant: appliance.exact_variant ?? null,
    gcNumber: appliance.gc_number ?? normalized,
    fuelType: appliance.fuel_type ?? null,
    installationManualUrl: appliance.source_url ?? null,
    sparePartsUrl: null,
    sourceName: appliance.source_name ?? null,
    sourceUrl: appliance.source_url ?? null,
    dateVerified: appliance.date_verified ?? null,
    generatedByAi: Boolean(appliance.generated_by_ai ?? false),
    verifiedExactMatch: true,
    message: "Verified exact match",
  };
}
