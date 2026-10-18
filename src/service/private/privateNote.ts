import {
  decryptPrivatePayload,
  encryptPrivatePayload,
  type PrivateNotePayload,
} from "./crypto";

import { authenticateForPrivateNote } from "./auth";

import type { EncryptedPrivateNoteData } from "@/types/privateNote";

export interface PrivateNoteRepository {
  getById(id: string): Promise<{
    id: string;
    title: string;
    content: string;
    updatedAt?: string;
  } | null>;

  replaceWithEncrypted(record: EncryptedPrivateNoteData): Promise<void>;

  getEncryptedById(id: string): Promise<EncryptedPrivateNoteData | null>;

  saveEncrypted(record: EncryptedPrivateNoteData): Promise<void>;
}

function createUpdatedAt(): string {
  return new Date().toISOString();
}

export async function makeNotePrivate(
  note: {
    id: string;
    title: string;
    content: string;
    updatedAt?: string;
  },
  repository: PrivateNoteRepository,
): Promise<void> {
  const authenticated = await authenticateForPrivateNote();

  if (!authenticated) {
    throw new Error("Authentication cancelled.");
  }

  const updatedAt = createUpdatedAt();

  const payload: PrivateNotePayload = {
    id: note.id,
    content: note.content,
    updatedAt,
  };

  const encryptedData = await encryptPrivatePayload(payload);

  await repository.replaceWithEncrypted({
    id: note.id,
    isPrivate: true,
    encryptionVersion: 1,
    encryptedData,
    updatedAt,
  });
}

export async function openPrivateNote(
  id: string,
  repository: PrivateNoteRepository,
): Promise<PrivateNotePayload> {
  const authenticated = await authenticateForPrivateNote();

  if (!authenticated) {
    throw new Error("Authentication cancelled.");
  }

  const record = await repository.getEncryptedById(id);

  if (!record || record.isPrivate !== true) {
    throw new Error("Private note not found.");
  }

  if (record.encryptionVersion !== 1) {
    throw new Error("Unsupported encryption version.");
  }

  const payload = await decryptPrivatePayload(record.encryptedData);

  if (payload.id !== id) {
    throw new Error("Private note integrity check failed.");
  }

  return payload;
}

export async function savePrivateNote(
  payload: PrivateNotePayload,
  repository: PrivateNoteRepository,
): Promise<void> {
  const updatedAt = createUpdatedAt();

  const updatedPayload: PrivateNotePayload = {
    ...payload,
    updatedAt,
  };

  const encryptedData = await encryptPrivatePayload(updatedPayload);

  await repository.saveEncrypted({
    id: payload.id,
    isPrivate: true,
    encryptionVersion: 1,
    encryptedData,
    updatedAt,
  });
}
