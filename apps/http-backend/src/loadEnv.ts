import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const local = resolve(process.cwd(), ".env");
const shared = resolve(process.cwd(), "../../packages/db/.env");

if (existsSync(local)) config({ path: local });
else if (existsSync(shared)) config({ path: shared });
