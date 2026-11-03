import { describe, expect, test } from "bun:test";
import { assessAudit } from "./audit-frontend.mjs";

const advisory = {
  url: "https://github.com/advisories/GHSA-g3hv-75wg-m249",
  title: "minimatch globparts amplification", severity: "moderate",
};
const other = { url: "https://github.com/advisories/GHSA-other", severity: "high" };
const result = (findings, exitCode = 1) => ({ stdout: JSON.stringify(findings), exitCode });
const lock = (...versions) => ({ packages: Object.fromEntries(versions.map((version, index) => [
  index ? `parent-${index}/minimatch` : "minimatch", [`minimatch@${version}`, "", {}],
])) });

describe("frontend dependency audit", () => {
  test("documents only the exact legacy false positive after modern copies are patched", () => {
    expect(assessAudit(result({ minimatch: [advisory] }), lock("3.1.5", "11.0.4")))
      .toEqual({ findings: {}, exceptions: 1 });
    expect(assessAudit(result({ minimatch: [advisory] }), lock("3.1.5")))
      .toEqual({ findings: {}, exceptions: 1 });
  });

  test("a vulnerable modern copy cannot be masked by an unaffected legacy copy", () => {
    for (const version of ["10.2.6", "10.2.2", "11.0.0"]) {
      expect(assessAudit(result({ minimatch: [advisory] }), lock("3.1.5", version)))
        .toEqual({ findings: { minimatch: [advisory] }, exceptions: 0 });
    }
  });

  test("unknown legacy versions, prereleases and missing package evidence cannot bypass findings", () => {
    for (const versions of [[], ["3.1.4"], ["3.1.5", "9.0.0"], ["3.1.5", "11.0.4-beta.1"], ["3.1.5", "latest"]]) {
      expect(assessAudit(result({ minimatch: [advisory] }), lock(...versions)))
        .toEqual({ findings: { minimatch: [advisory] }, exceptions: 0 });
    }
    expect(() => assessAudit(result({ minimatch: [advisory] }), null)).toThrow();
    expect(() => assessAudit(result({ minimatch: [advisory] }), { packages: { minimatch: [] } })).toThrow();
  });

  test("the same advisory reported for a different package stays blocking", () => {
    expect(assessAudit(result({ another: [advisory] }), lock("3.1.5", "11.0.4")))
      .toEqual({ findings: { another: [advisory] }, exceptions: 0 });
  });

  test("different advisories and mixed-package findings remain intact", () => {
    expect(assessAudit(result({ minimatch: [advisory, other], another: [other] }), lock("3.1.5", "11.0.4")))
      .toEqual({ findings: { minimatch: [other], another: [other] }, exceptions: 1 });
  });

  test("network failure, invalid response and inconsistent exit status fail closed", () => {
    for (const invalid of [
      { stdout: "Failed to reach registry", exitCode: 1 },
      result({}, 1), result({}, 2), result({ error: "Registry unavailable" }),
      result({ minimatch: [{}] }), result({ minimatch: [] }), result([]), result(null),
    ]) {
      expect(() => assessAudit(invalid, lock("3.1.5", "11.0.4"))).toThrow();
    }
  });

  test("a clean completed audit passes without an exception", () => {
    expect(assessAudit(result({}, 0), lock("11.0.4")))
      .toEqual({ findings: {}, exceptions: 0 });
  });
});
