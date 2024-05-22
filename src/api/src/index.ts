import express, { Express } from "express";
import { config } from "dotenv";
import cors from "cors";
import { router } from "./routes";

export const app: Express = express();

// Load environment variables
config();
config({ path: ".env.local", override: true });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use("/", router);

// Define the port
const port: number = (process.env.PORT || 8080) as number;

// Start the server
app.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});

export default app;
