import { exec } from "node:child_process";
import { Pool } from "pg";
import http from "http";
import z from "zod";
import chalk from "chalk";

console.log(process.cwd())

const envSchema = z.object({
    DATABASE_URL: z.string(),
    MIGRATOR_PORT: z.coerce
        .number()
        .default(3000),
    MIGRATOR_RETRIES: z.coerce
        .number()
        .default(5),
    MIGRATOR_WAIT_INTERVAL: z.coerce
        .number()
        .default(3),
    MIGRATOR_GRACE_PERIOD: z.coerce
        .number()
        .default(30),
    MIGRATOR_SCHEMA_FILE: z.string()
        .default("./models/schemas/index.js"),
})

const parsed = envSchema.parse(process.env);

const {
    MIGRATOR_PORT,
    MIGRATOR_WAIT_INTERVAL,
    MIGRATOR_GRACE_PERIOD,
    DATABASE_URL,
    MIGRATOR_SCHEMA_FILE,
} = parsed;

let {
    MIGRATOR_RETRIES
} = parsed;

type State = "pending" | "running" | "success" | "error";
type StateResponse = {
  state: State;
  error?: string | null;
}
let migrationState: State = "pending";
let migrationError: string | null;

async function waitForDb() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  console.log(`Querying at url: ${chalk.blueBright(DATABASE_URL)}`);

  let i = 0;
  while (true) {
    try {
      await pool.query("SELECT 1");
      await pool.end();
      console.log("✅ Database is ready");
      return;
    } catch (err) {
      console.log("⏳ Waiting for database...");
      await new Promise((res) => setTimeout(res, MIGRATOR_WAIT_INTERVAL * 1000));
    }

    if (MIGRATOR_RETRIES != 0 && i >= MIGRATOR_RETRIES) {
      console.error(`❌ Database not ready after ${MIGRATOR_RETRIES * MIGRATOR_WAIT_INTERVAL} seconds`);
      throw new Error("Database not ready after retries");
      
    }

    i++;
  }
}

function scheduleExit() {
  console.log(`🕒 Grace period started. Migrator will exit in ${MIGRATOR_GRACE_PERIOD} seconds.`);
  setTimeout(() => {
    console.log("👋 Migrator exiting after grace period.");
    process.exit(migrationState === "success" ? 0 : 1);
  }, MIGRATOR_GRACE_PERIOD * 1000);
}

async function runMigration() {
  migrationState = "running";
  try {
    await waitForDb();
    await new Promise<void>((resolve, reject) => {
        exec(
            [
                'npx drizzle-kit push',
                '--force',
                `--schema "${MIGRATOR_SCHEMA_FILE}"`,
                `--url "${DATABASE_URL}"`,
                '--dialect postgresql',
            ].join(" "),
            (error, stdout, stderr) => {
                if (stderr) {
                    console.error(`Error output: ${stderr}`);
                }
                if (stdout) {
                    console.log(`Migration output: ${stdout}`);
                }
                if (error) {
                    migrationState = "error";
                    migrationError = error.message;
                    console.error(`Error executing migration: ${error.message}`);
                    reject(error)
                }
                migrationState = "success";
                resolve();
            }
        );
    });
    migrationState = "success";
    console.log("✅ Migration completed successfully");
  } catch (err: any) {
    migrationState = "error";
    migrationError = err.message || "Unknown error";
    console.error("❌ Migration failed:");
    console.error(err);
  } finally{
    scheduleExit();
  } 
}

// Simple HTTP server to report migration state
const server = http.createServer((req, res) => {
  if (req.url === "/state") {
    res.writeHead(200, { "Content-Type": "application/json" });
    const body: StateResponse = {
      state: migrationState,
    }
    if (migrationState === "error") {
        body.error = migrationError || "Unknown error";
    }
    res.end(
      JSON.stringify(body, null, 2)
    );
  } else {
    res.writeHead(404);
    res.end("Migrator is running, check /state for status");
  }
});

server.listen(MIGRATOR_PORT, () => {
  console.log(`🚀  Migrator state server running on port ${MIGRATOR_PORT}`);
  runMigration();
});