import { $ } from "bun";

const cleanup = async () => {
  console.log("\n\nShutting down...");
  await $`lsof -ti:8000,3000 2>/dev/null | xargs kill -9 2>/dev/null`.quiet();
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Kill any existing processes on ports
await $`lsof -ti:8000,3000 2>/dev/null | xargs kill -9 2>/dev/null`.quiet();

console.log("\x1b[34m[backend]\x1b[0m  http://localhost:8000");
console.log("\x1b[35m[frontend]\x1b[0m http://localhost:3000\n");

const backend = Bun.spawn(
  ["python3.12", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
  {
    cwd: "./backend",
    stdout: "inherit",
    stderr: "inherit",
  }
);

const frontend = Bun.spawn(["bun", "dev"], {
  cwd: "./frontend",
  stdout: "inherit",
  stderr: "inherit",
});

await Promise.all([backend.exited, frontend.exited]);
