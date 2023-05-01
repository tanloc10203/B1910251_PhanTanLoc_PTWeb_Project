require("dotenv").config();
const app = require("./src/app");
const cluster = require("cluster");
const os = require("os");

const PORT = process.env.PORT || 4040;

if (cluster.isPrimary) {
  console.log("Master process is running");
  const NUM_WORKERS = os.cpus().length;

  for (let i = 0; i <= NUM_WORKERS; i++) {
    cluster.fork();
  }

  const server = app.listen(PORT, () => {
    console.log("Server on running on http://localhost:" + PORT);
  });

  process.on("SIGINT", () => {
    server.close(() => console.log("Exits server express"));
  });

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log("Worker process is running");
}
