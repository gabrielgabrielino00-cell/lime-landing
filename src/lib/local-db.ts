import { promises as fs } from "fs";
import path from "path";
import type { ModelId } from "@/types/models";
import type { UserPlan } from "@/types/project";

const DATA_DIR = path.join(process.cwd(), ".limeforge-data");

export interface LocalProfile {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  requestsUsed: number;
  requestsLimit: number;
  stripeCustomerId?: string;
}

export interface LocalProject {
  id: string;
  userId: string;
  name: string;
  modelId: ModelId;
  output: string;
  createdAt: string;
  updatedAt: string;
  files: Array<{ id: string; name: string; language: string; content: string }>;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    modelId?: ModelId;
    createdAt: string;
  }>;
  versions: Array<{
    id: string;
    promptUsed: string;
    modelId: ModelId;
    outputSnapshot: string;
    label?: string;
    createdAt: string;
  }>;
}

export interface LocalApiKey {
  id: string;
  userId: string;
  keyHash: string;
  keyPrefix: string;
  label: string;
  createdAt: string;
}

interface DbShape {
  profiles: LocalProfile[];
  projects: LocalProject[];
  apiKeys: LocalApiKey[];
}

const DEFAULT_DB: DbShape = { profiles: [], projects: [], apiKeys: [] };

async function ensureDb(): Promise<DbShape> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, "db.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as DbShape;
  } catch {
    await fs.writeFile(file, JSON.stringify(DEFAULT_DB, null, 2));
    return structuredClone(DEFAULT_DB);
  }
}

async function saveDb(db: DbShape) {
  const file = path.join(DATA_DIR, "db.json");
  await fs.writeFile(file, JSON.stringify(db, null, 2));
}

export async function localGetOrCreateProfile(
  id: string,
  email: string,
  name: string,
): Promise<LocalProfile> {
  const db = await ensureDb();
  let profile = db.profiles.find((p) => p.id === id);
  if (!profile) {
    const isLocalDev = id.startsWith("local-");
    profile = {
      id,
      email,
      name,
      plan: isLocalDev ? "pro" : "free",
      requestsUsed: 0,
      requestsLimit: 9999,
    };
    db.profiles.push(profile);
    await saveDb(db);
  } else {
    let changed = false;
    if (profile.requestsLimit < 1000) {
      profile.requestsLimit = 9999;
      changed = true;
    }
    if (id.startsWith("local-") && profile.plan === "free") {
      profile.plan = "pro";
      changed = true;
    }
    if (changed) await saveDb(db);
  }
  return profile;
}

export async function localUpdateProfile(
  id: string,
  patch: Partial<LocalProfile>,
): Promise<LocalProfile> {
  const db = await ensureDb();
  const idx = db.profiles.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Profile not found");
  db.profiles[idx] = { ...db.profiles[idx], ...patch };
  await saveDb(db);
  return db.profiles[idx];
}

export async function localListProjects(userId: string): Promise<LocalProject[]> {
  const db = await ensureDb();
  return db.projects.filter((p) => p.userId === userId);
}

export async function localGetProject(
  userId: string,
  projectId: string,
): Promise<LocalProject | null> {
  const db = await ensureDb();
  return (
    db.projects.find((p) => p.id === projectId && p.userId === userId) ?? null
  );
}

export async function localCreateProject(
  userId: string,
  name: string,
  modelId: ModelId,
): Promise<LocalProject> {
  const db = await ensureDb();
  const now = new Date().toISOString();
  const project: LocalProject = {
    id: crypto.randomUUID(),
    userId,
    name,
    modelId,
    output: "",
    createdAt: now,
    updatedAt: now,
    files: [
      {
        id: crypto.randomUUID(),
        name: "Main.server.lua",
        language: "lua",
        content: "-- Start prompting to generate Luau code",
      },
    ],
    messages: [],
    versions: [],
  };
  db.projects.unshift(project);
  await saveDb(db);
  return project;
}

export async function localSaveProject(project: LocalProject) {
  const db = await ensureDb();
  const idx = db.projects.findIndex((p) => p.id === project.id);
  if (idx < 0) throw new Error("Project not found");
  project.updatedAt = new Date().toISOString();
  db.projects[idx] = project;
  await saveDb(db);
  return project;
}

export async function localCreateApiKey(
  userId: string,
  keyHash: string,
  keyPrefix: string,
  label: string,
): Promise<LocalApiKey> {
  const db = await ensureDb();
  const row: LocalApiKey = {
    id: crypto.randomUUID(),
    userId,
    keyHash,
    keyPrefix,
    label,
    createdAt: new Date().toISOString(),
  };
  db.apiKeys.push(row);
  await saveDb(db);
  return row;
}

export async function localFindApiKey(keyHash: string): Promise<LocalApiKey | null> {
  const db = await ensureDb();
  return db.apiKeys.find((k) => k.keyHash === keyHash) ?? null;
}