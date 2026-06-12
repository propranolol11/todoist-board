import type { TodoistBoardSettings } from "./types";

export const TODOIST_API_TOKEN_SECRET_ID = "todoist-board-api-token";

export interface SecretStorageLike {
  getSecret(id: string): string | null;
  setSecret(id: string, secret: string): void;
  listSecrets?(): string[];
}

export interface AppWithSecretStorage {
  secretStorage?: SecretStorageLike;
}

export interface TokenLoadResult {
  token: string;
  migrated: boolean;
  storage: "secrets" | "plugin-data";
  shouldRewriteSettings: boolean;
}

function normalizeToken(value: unknown): string {
  return String(value || "")
    .trim()
    .replace(/^Bearer\s+/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}

export class TodoistTokenStorage {
  private readonly secretStorage?: SecretStorageLike;
  private readonly secretId: string;

  constructor(app?: AppWithSecretStorage, secretId = TODOIST_API_TOKEN_SECRET_ID) {
    this.secretStorage = app?.secretStorage;
    this.secretId = secretId;
  }

  hasSecretStorage(): boolean {
    return !!this.secretStorage;
  }

  loadToken(legacyToken: unknown): TokenLoadResult {
    const settingsToken = normalizeToken(legacyToken);
    const secretToken = this.readSecret();

    if (secretToken) {
      return {
        token: secretToken,
        migrated: false,
        storage: "secrets",
        shouldRewriteSettings: !!settingsToken,
      };
    }

    if (settingsToken && this.writeSecret(settingsToken)) {
      return {
        token: settingsToken,
        migrated: true,
        storage: "secrets",
        shouldRewriteSettings: true,
      };
    }

    return {
      token: settingsToken,
      migrated: false,
      storage: "plugin-data",
      shouldRewriteSettings: false,
    };
  }

  prepareSettingsForSave<T extends TodoistBoardSettings>(settings: T): T {
    const token = normalizeToken(settings.apiKey);
    const next = { ...settings, apiKey: token };

    if (!this.hasSecretStorage()) {
      return next;
    }

    if (this.writeSecret(token)) {
      return { ...next, apiKey: "" };
    }

    return next;
  }

  private readSecret(): string {
    if (!this.secretStorage) return "";
    try {
      return normalizeToken(this.secretStorage.getSecret(this.secretId));
    } catch {
      return "";
    }
  }

  private writeSecret(token: string): boolean {
    if (!this.secretStorage) return false;
    try {
      this.secretStorage.setSecret(this.secretId, token);
      return true;
    } catch {
      return false;
    }
  }
}
