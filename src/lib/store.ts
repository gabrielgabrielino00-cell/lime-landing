"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModelId } from "@/types/models";
import type { Project, UserPlan, UserProfile } from "@/types/project";

function uid() {
  return crypto.randomUUID();
}

const DEMO_USER: UserProfile = {
  id: "dev-user",
  name: "Creator",
  email: "dev@limeforge.local",
  plan: "free",
  requestsUsed: 12,
  requestsLimit: 50,
};

function createProject(name: string, modelId: ModelId): Project {
  const now = new Date().toISOString();
  const id = uid();
  return {
    id,
    name,
    modelId,
    createdAt: now,
    updatedAt: now,
    messages: [],
    output: "",
    versions: [],
    files: [
      {
        id: uid(),
        name: "Main.server.lua",
        language: "lua",
        content: "-- Start prompting to generate Luau code",
      },
    ],
  };
}

interface AppState {
  user: UserProfile;
  projects: Project[];
  activeProjectId: string | null;
  selectedModelId: ModelId;
  isAuthenticated: boolean;

  loginDev: () => void;
  logout: () => void;
  setPlan: (plan: UserPlan) => void;
  setModel: (modelId: ModelId) => void;
  createProject: (name?: string) => string;
  setActiveProject: (id: string) => void;
  addMessage: (projectId: string, role: "user" | "assistant", content: string, modelId?: ModelId) => void;
  setOutput: (projectId: string, output: string, code: string, prompt: string, modelId: ModelId) => void;
  incrementRequests: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: DEMO_USER,
      projects: [createProject("Obby Leaderstats", "claude-sonnet-4-6")],
      activeProjectId: null,
      selectedModelId: "claude-sonnet-4-6",
      isAuthenticated: true,

      loginDev: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      setPlan: (plan) =>
        set((s) => ({
          user: {
            ...s.user,
            plan,
            requestsLimit: plan === "free" ? 50 : 999_999,
          },
        })),

      setModel: (modelId) => set({ selectedModelId: modelId }),

      createProject: (name) => {
        const project = createProject(
          name ?? `Project ${get().projects.length + 1}`,
          get().selectedModelId,
        );
        set((s) => ({
          projects: [project, ...s.projects],
          activeProjectId: project.id,
        }));
        return project.id;
      },

      setActiveProject: (id) => set({ activeProjectId: id }),

      addMessage: (projectId, role, content, modelId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  messages: [
                    ...p.messages,
                    {
                      id: uid(),
                      role,
                      content,
                      modelId,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : p,
          ),
        })),

      setOutput: (projectId, output, code, prompt, modelId) =>
        set((s) => {
          const prev = s.projects.find((p) => p.id === projectId);
          const versionId = uid();
          return {
            projects: s.projects.map((p) =>
              p.id === projectId
                ? {
                    ...p,
                    output,
                    updatedAt: new Date().toISOString(),
                    files: p.files.map((f, i) =>
                      i === 0 ? { ...f, content: code } : f,
                    ),
                    versions: [
                      {
                        id: versionId,
                        projectId,
                        createdAt: new Date().toISOString(),
                        promptUsed: prompt,
                        modelId,
                        outputSnapshot: code,
                        label: `v${p.versions.length + 1}`,
                        restorable: true,
                      },
                      ...p.versions,
                    ],
                  }
                : p,
            ),
          };
        }),

      incrementRequests: () => {
        const { user } = get();
        if (user.requestsUsed >= user.requestsLimit) return false;
        set((s) => ({
          user: { ...s.user, requestsUsed: s.user.requestsUsed + 1 },
        }));
        return true;
      },
    }),
    { name: "limeforge-store" },
  ),
);

export function useActiveProject() {
  return useAppStore((s) => {
    const id = s.activeProjectId ?? s.projects[0]?.id ?? null;
    return s.projects.find((p) => p.id === id) ?? null;
  });
}