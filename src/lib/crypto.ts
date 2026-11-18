import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Derives a 32-byte encryption key from the environment variable
 */
function getEncryptionKey(): Buffer {
  const envKey = process.env.VAULT_ENCRYPTION_KEY || "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  return crypto.scryptSync(envKey, "digitalx-salt-vault", 32);
}

/**
 * Encrypts a plaintext string using AES-256-GCM
 * Returns base64 encoded string containing: iv + authTag + ciphertext
 */
export function encryptVaultData(text: string): string {
  if (!text) return "";
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  const authTag = cipher.getAuthTag();

  // Combine iv, authTag, and ciphertext into a serialized payload
  const payload = Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, "base64")
  ]);

  return payload.toString("base64");
}

/**
 * Decrypts an AES-256-GCM encrypted string
 */
export function decryptVaultData(encryptedBase64: string): string {
  if (!encryptedBase64) return "";
  try {
    const key = getEncryptionKey();
    const data = Buffer.from(encryptedBase64, "base64");

    if (data.length < IV_LENGTH + AUTH_TAG_LENGTH) {
      throw new Error("Invalid ciphertext buffer length");
    }

    const iv = data.subarray(0, IV_LENGTH);
    const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, undefined, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Vault decryption error:", error);
    return "[Decryption Failed - Invalid Key or Corrupted Payload]";
  }
}

/**
 * Mask National ID / CNIC (e.g. 42101-1234567-8 -> *****-*******-8)
 */
export function maskCnic(cnic: string): string {
  if (!cnic || cnic.length < 5) return "***-****-***";
  const clean = cnic.trim();
  const lastFour = clean.slice(-4);
  return `***-****-${lastFour}`;
}

/**
 * Mask Bank Account / IBAN
 */
export function maskBankAccount(account: string, bankName?: string): string {
  if (!account) return "Masked Account";
  const clean = account.replace(/\s+/g, "");
  const lastFour = clean.slice(-4);
  return `${bankName ? bankName + " " : ""}•••• •••• ${lastFour}`;
}
