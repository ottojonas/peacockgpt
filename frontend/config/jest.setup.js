import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import dotenv from "dotenv";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

dotenv.config({ path: "./frontend/.env.local" });
