const LEGACY_ADVISORY = "https://github.com/advisories/GHSA-g3hv-75wg-m249";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function patchedMinimatch(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:\+[\w.-]+)?$/.exec(version);
  if (!match) return false;
  const [major, minor, patch] = match.slice(1).map(Number);
  if (![major, minor, patch].every(Number.isSafeInteger)) return false;
  return major > 11 || (major === 11 && (minor > 0 || patch >= 1));
}

export function assessAudit(result, lock) {
  if (!isRecord(lock) || !isRecord(lock.packages)) {
    throw new Error("A readable Bun lockfile with package records is required");
  }
  if (result.exitCode !== 0 && result.exitCode !== 1) {
    throw new Error(`bun audit did not complete (exit ${result.exitCode})`);
  }
  const audit = JSON.parse(result.stdout);
  if (!isRecord(audit)) throw new Error("Unexpected bun audit response");
  if (result.exitCode !== 0 && Object.keys(audit).length === 0) {
    throw new Error("bun audit failed without returning findings");
  }

  const minimatchVersions = [];
  for (const [name, entry] of Object.entries(lock.packages)) {
    const descriptor = Array.isArray(entry) ? entry[0] : undefined;
    if (name === "minimatch" || name.endsWith("/minimatch") || descriptor?.startsWith?.("minimatch@")) {
      if (typeof descriptor !== "string" || !descriptor.startsWith("minimatch@")) {
        throw new Error("Invalid minimatch lockfile record");
      }
      minimatchVersions.push(descriptor.slice("minimatch@".length));
    }
  }
  // The maintainer identifies firstPhasePreProcess() in 10.2.6 as affected.
  // That implementation does not exist in legacy 3.1.5. Keep this exception
  // exact; a vulnerable modern copy must not be hidden by a legacy copy.
  // https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249
  const legacyOnly = minimatchVersions.includes("3.1.5") && minimatchVersions.every(
    (version) => version === "3.1.5" || patchedMinimatch(version),
  );
  const findings = {};
  let exceptions = 0;
  for (const [name, advisories] of Object.entries(audit)) {
    if (!Array.isArray(advisories) || !advisories.length || !advisories.every((item) => isRecord(item) && typeof item.url === "string")) {
      throw new Error("Unexpected bun audit findings");
    }
    const remaining = advisories.filter((advisory) => {
      if (name === "minimatch" && advisory.url === LEGACY_ADVISORY && legacyOnly) {
        exceptions++;
        return false;
      }
      return true;
    });
    if (remaining.length) findings[name] = remaining;
  }
  return { findings, exceptions };
}

if (import.meta.main) {
  try {
    const frontend = new URL("../frontend/", import.meta.url);
    const lock = Bun.JSONC.parse(await Bun.file(new URL("bun.lock", frontend)).text());
    const result = Bun.spawnSync([process.execPath, "audit", "--json"], {
      cwd: fileURLToPath(frontend),
      stdout: "pipe",
      stderr: "inherit",
      timeout: 30_000,
    });
    if (result.error) throw result.error;
    const { findings, exceptions } = assessAudit({
      stdout: new TextDecoder().decode(result.stdout), exitCode: result.exitCode,
    }, lock);
    if (exceptions) {
      console.log("Documented false positive: GHSA-g3hv-75wg-m249 for minimatch 3.1.5 only; modern copies are patched.");
    }
    if (Object.keys(findings).length) {
      console.error(JSON.stringify(findings, null, 2));
      process.exitCode = 1;
    } else {
      console.log("Dependency audit passed.");
    }
  } catch (error) {
    console.error("Dependency audit failed:", error.message);
    process.exitCode = 1;
  }
}
import { fileURLToPath } from "node:url";

