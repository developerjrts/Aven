import { gcm } from "@noble/ciphers/aes.js";
import { bytesToUtf8, utf8ToBytes } from "@noble/ciphers/utils.js";
import { getRandomBytes } from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import type { PrivateNotePayload } from "@/types/privateNote";

export type { PrivateNotePayload } from "@/types/privateNote";

const KEY_NAME = "aven.private-notes.key.v1";
const ENCRYPTION_PREFIX = "v1";
const KEY_LENGTH = 32;
const NONCE_LENGTH = 12;
const TAG_LENGTH = 16;

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) {
    throw new Error("Invalid encrypted data format.");
  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function isPrivateNotePayload(value: unknown): value is PrivateNotePayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.id === "string" &&
    payload.id.length > 0 &&
    typeof payload.content === "string" &&
    typeof payload.updatedAt === "string" &&
    !Number.isNaN(Date.parse(payload.updatedAt))
  );
}

async function getOrCreateKey(): Promise<Uint8Array> {
  const storedKey = await SecureStore.getItemAsync(KEY_NAME);

  if (storedKey !== null) {
    const key = fromHex(storedKey);

    if (key.length !== KEY_LENGTH) {
      throw new Error("The private-note encryption key is invalid.");
    }

    return key;
  }

  const key = getRandomBytes(KEY_LENGTH);

  await SecureStore.setItemAsync(KEY_NAME, toHex(key));

  return key;
}

async function getExistingKey(): Promise<Uint8Array> {
  const storedKey = await SecureStore.getItemAsync(KEY_NAME);

  if (storedKey === null) {
    throw new Error(
      "The private-note encryption key is missing. " +
        "The note cannot be decrypted.",
    );
  }

  const key = fromHex(storedKey);

  if (key.length !== KEY_LENGTH) {
    throw new Error("The private-note encryption key is invalid.");
  }

  return key;
}

export async function encryptPrivatePayload(
  payload: PrivateNotePayload,
): Promise<string> {
  if (!isPrivateNotePayload(payload)) {
    throw new Error("Cannot encrypt an invalid private-note payload.");
  }

  const key = await getOrCreateKey();
  const nonce = getRandomBytes(NONCE_LENGTH);

  const plaintext = utf8ToBytes(JSON.stringify(payload));
  const ciphertext = gcm(key, nonce).encrypt(plaintext);

  // Format: version.nonce.ciphertext-with-authentication-tag
  return `${ENCRYPTION_PREFIX}.${toHex(nonce)}.${toHex(ciphertext)}`;
}

export async function decryptPrivatePayload(
  encryptedData: string,
): Promise<PrivateNotePayload> {
  const parts = encryptedData.split(".");

  if (parts.length !== 3 || parts[0] !== ENCRYPTION_PREFIX) {
    throw new Error("Unsupported private-note encryption format.");
  }

  const nonce = fromHex(parts[1]);
  const ciphertext = fromHex(parts[2]);

  if (nonce.length !== NONCE_LENGTH || ciphertext.length < TAG_LENGTH) {
    throw new Error("Private-note encrypted data is invalid.");
  }

  const key = await getExistingKey();

  // AES-GCM verifies the authentication tag before returning plaintext.
  const plaintext = gcm(key, nonce).decrypt(ciphertext);

  let parsed: unknown;

  try {
    parsed = JSON.parse(bytesToUtf8(plaintext));
  } catch {
    throw new Error("Could not read the decrypted private note.");
  }

  if (!isPrivateNotePayload(parsed)) {
    throw new Error("Private-note content is invalid.");
  }

  return parsed;
}
