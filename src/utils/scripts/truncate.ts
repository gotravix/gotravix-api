import { db } from "@/config/db";
import { sql } from "drizzle-orm";


const truncate = async () => {
    const tables = (await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema='public';
    `)).rows.map((row) => row["table_name"]) as string[];
    
    await db.execute(
        sql.raw([
            "TRUNCATE", 
            tables
                .map((tableName)=>`"${tableName}"`)
                .join(", "),
            "RESTART IDENTITY CASCADE"
        ].join(" ") + ";"
        )
    )
    
}

if (require.main === module) {
    truncate()

}