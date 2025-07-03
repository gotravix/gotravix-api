import { Router, Request, Response } from "express";
import {db, pool} from "@/config/db";
import { listBuckets } from "@repositories/s3";
import { transporter } from "@/helpers/sendEmail";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const checks: Record<string, boolean> = {};

  // Database check
  try {
    await pool.query("SELECT 1");
    checks.db = true;
  } catch {
    checks.db = false;
  }

  // S3 connectivity check
  try {
    await listBuckets();
    checks.s3 = true;
  } catch {
    checks.s3 = false;
  }

  // SMTP check (optional)
  try {
    checks.smtp = await transporter.verify()
  } catch {
    checks.smtp = false;
  }

  // Validate all checks
  const allHealthy = Object.values(checks).every(Boolean);

  if (allHealthy) {
    res.status(200).json({ ok: true, status: "healthy", checks });
  } else {
    res.status(503).json({ ok: false, status: "unhealthy", checks });
  }
});

module.exports = router;