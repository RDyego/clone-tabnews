const { exec } = require("node:child_process");

const messageWaiting = "Waiting for Postgres";
const messageReady = "Postgres ready!";

const startedAt = Date.now();
function showElapsedTime() {
  return `${((Date.now() - startedAt) / 1000).toFixed(2)}s`;
}
function showSpinner() {
  const intervalToUpdateMs = 200;
  const spinner = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
  const index = Math.floor(Date.now() / intervalToUpdateMs) % spinner.length;
  return `${showElapsedTime()} ${spinner[index]}`;
}

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(`\r🟡 ${messageWaiting} ${showSpinner()}`);
      checkPostgres();
      return;
    }
    process.stdout.write(`\r⚫ ${messageWaiting} - ${showElapsedTime()}`);
    process.stdout.write(`\n🟢 ${messageReady}\n`);
  }
}

process.stdout.write(`\n\n🔴 ${messageWaiting}`);
checkPostgres();
