export interface PrivateNotePayload {
  id: string;
  content: string;
  updatedAt: string;
}

export type BiometricMethod = "fingerprint" | "face" | "iris";

export type PrivateNoteEncryptionVersion = 1;

export type EncryptedPrivateNoteData = {
  id: string;
  isPrivate: true;
  encryptionVersion: PrivateNoteEncryptionVersion;
  encryptedData: string;
  updatedAt: string;
};

export type PrivateNoteMetadata = {
  id: string;
  isPrivate: true;
  pinned: boolean;
  updatedAt: string;
  encryptedData: string;
  encryptionVersion: PrivateNoteEncryptionVersion;
};

export type UnlockedPrivateNote = {
  id: string;
  title: string;
  content: string;
  isPrivate: true;
  pinned: boolean;
  updatedAt: string;
};

export type PrivateNoteUnlockState =
  | { status: "locked" }
  | { status: "authenticating" }
  | { status: "unlocked"; noteId: string }
  | { status: "failed"; message: string };

export type PrivateNoteAuthResult =
  | { success: true }
  | {
      success: false;
      reason:
        | "cancelled"
        | "not_available"
        | "not_enrolled"
        | "authentication_failed";
    };

export type PrivateNoteCryptoResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type MakeNotePrivateInput = {
  noteId: string;
};

export type UpdatePrivateNoteInput = {
  noteId: string;
  title: string;
  content: string;
};

export type CreatePrivateNoteInput = {
  title: string;
  content: string;
};

export function isEncryptedPrivateNote(
  value: unknown,
): value is EncryptedPrivateNoteData {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const note = value as Record<string, unknown>;

  return (
    typeof note.id === "string" &&
    note.isPrivate === true &&
    note.encryptionVersion === 1 &&
    typeof note.encryptedData === "string" &&
    typeof note.updatedAt === "string"
  );
}
