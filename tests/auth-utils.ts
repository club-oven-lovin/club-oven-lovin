/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import { test as base, Page, request } from "@playwright/test";
type StorageState = any;
import fs from "fs";
import path from "path";
import { PLAYWRIGHT_BASE_URL } from "./test-helpers";

const BASE_URL = PLAYWRIGHT_BASE_URL;
const SESSION_STORAGE_PATH = path.join(__dirname, "playwright-auth-sessions");

if (!fs.existsSync(SESSION_STORAGE_PATH)) {
  fs.mkdirSync(SESSION_STORAGE_PATH, { recursive: true });
}

interface AuthFixtures {
  getUserPage: (email: string, password: string) => Promise<Page>;
}

async function hasValidSession(
  email: string,
  storageState: StorageState,
): Promise<boolean> {
  const requestContext = await request.newContext({
    baseURL: BASE_URL,
    storageState,
  });

  try {
    const response = await requestContext.get("/api/auth/session");
    if (!response.ok()) {
      return false;
    }
    const data = await response.json();
    return data?.user?.email === email;
  } catch {
    return false;
  } finally {
    await requestContext.dispose();
  }
}

async function loginViaApi(
  email: string,
  password: string,
): Promise<StorageState> {
  const requestContext = await request.newContext({
    baseURL: BASE_URL,
  });

  try {
    const csrfResponse = await requestContext.get("/api/auth/csrf");
    if (!csrfResponse.ok()) {
      throw new Error(`Failed to fetch CSRF token: ${csrfResponse.status()}`);
    }
    const { csrfToken } = await csrfResponse.json();

    const loginResponse = await requestContext.post(
      "/api/auth/callback/credentials?json=true",
      {
        form: {
          csrfToken,
          email,
          password,
          callbackUrl: `${BASE_URL}/user-home-page`,
          json: "true",
        },
      },
    );

    if (!loginResponse.ok()) {
      const body = await loginResponse.text();
      throw new Error(
        `Login failed with status ${loginResponse.status()}: ${body}`,
      );
    }

    return requestContext.storageState();
  } finally {
    await requestContext.dispose();
  }
}

async function ensureStorageState(
  email: string,
  password: string,
  sessionName: string,
): Promise<StorageState> {
  const sessionPath = path.join(SESSION_STORAGE_PATH, `${sessionName}.json`);

  if (fs.existsSync(sessionPath)) {
    try {
      const savedState: StorageState = JSON.parse(
        fs.readFileSync(sessionPath, "utf8"),
      );
      if (await hasValidSession(email, savedState)) {
        console.log(`✓ Restored session for ${email}`);
        return savedState;
      }
      console.log(`× Saved session for ${email} expired, re-authenticating...`);
    } catch (error) {
      console.log(`× Error restoring session for ${email}: ${error}`);
    }
  }

  console.log(`→ Authenticating ${email} via API...`);
  const storageState = await loginViaApi(email, password);
  fs.writeFileSync(sessionPath, JSON.stringify(storageState));
  console.log(`✓ Successfully authenticated ${email} and saved session`);
  return storageState;
}

export const test = base.extend<AuthFixtures>({
  getUserPage: async ({ browser }, use) => {
    const createUserPage = async (email: string, password: string) => {
      const storageState = await ensureStorageState(
        email,
        password,
        `session-${email}`,
      );
      const context = await browser.newContext({ storageState });
      const page = await context.newPage();
      return page;
    };

    await use(createUserPage);
  },
});

export { expect } from "@playwright/test";
