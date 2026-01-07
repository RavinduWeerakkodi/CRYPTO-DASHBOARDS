import { Scheduler } from "../server/services/scheduler";
import { storage } from "../server/storage";
import { pool } from "../server/db";

async function verify() {
    console.log("Starting Verification...");

    try {
        // 1. Run a generic cycle
        console.log("Running Scheduler Cycle...");
        await Scheduler.runCycle();

        // 2. Fetch predictions
        console.log("Fetching new predictions...");
        const predictions = await storage.getPredictions({ timeframe: '4H' });

        console.log(`Found ${predictions.length} total predictions.`);

        // Filter for recent ones (created in last minute)
        const recent = predictions.filter(p => {
            const created = new Date(p.createdAt!);
            return (Date.now() - created.getTime()) < 60000;
        });

        console.log(`Found ${recent.length} NEW predictions generated just now.`);

        if (recent.length > 0) {
            console.log("✅ Verification SUCCESS: Data pipeline is generating predictions.");
            console.log("Sample:", JSON.stringify(recent[0], null, 2));
        } else {
            console.log("❌ Verification FAILED: No new predictions generated.");
            console.log("Check logs for fetch errors.");
        }

    } catch (error) {
        console.error("Verification Error:", error);
    } finally {
        // Force exit
        await pool.end();
        process.exit(0);
    }
}

verify();
