// Starts the backend and frontend together. Ctrl+C stops both.
const python = process.platform === "win32" ? ["py", "-3.12"] : ["python3.12"];

console.log("\x1b[34m[backend]\x1b[0m  http://localhost:8000");
console.log("\x1b[35m[frontend]\x1b[0m http://localhost:3000\n");

const backend = Bun.spawn(
  [...python, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
  { cwd: "./backend", stdout: "inherit", stderr: "inherit" },
);

const frontend = Bun.spawn(["bun", "dev"], {
  cwd: "./frontend",
  stdout: "inherit",
  stderr: "inherit",
});

const stopAll = () => {
  backend.kill();
  frontend.kill();
};

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);

// If either one stops, stop the other too instead of leaving it running alone.
const exitCode = await Promise.race([backend.exited, frontend.exited]);
stopAll();
await Promise.all([backend.exited, frontend.exited]);
process.exit(exitCode);
