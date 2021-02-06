import { customAlphabet } from "nanoid";

const lower = "abcdefghijklmnopqrstuvwxyz";
const upper = lower.toUpperCase();
const digits = "1234567890";

export const generateRoomCode = customAlphabet(upper, 4);

const generateId = customAlphabet(lower + upper + digits, 10);

export default generateId;
