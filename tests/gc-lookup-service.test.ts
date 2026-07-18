import assert from "node:assert/strict";
import { lookupBoilerByGcNumber } from "../services/gc-lookup-service";

async function main() {
  delete process.env.GC_LOOKUP_API_BASE_URL;
  delete process.env.GC_LOOKUP_API_TOKEN;

  const result = await lookupBoilerByGcNumber("47-044-13");

  assert.equal(result.verifiedExactMatch, false);
  assert.equal(result.exactModel, null);
  assert.equal(result.manufacturer, null);
  assert.equal(result.message, "GC lookup is not yet connected to a verified appliance database.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
