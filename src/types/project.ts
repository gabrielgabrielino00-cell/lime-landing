import type { ModelId } from "@/types/models";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  modelId?: ModelId;
  createdAt: string;
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  createdAt: string;
  promptUsed: string;
  modelId: ModelId;
  outputSnapshot: string;
  diffFromPrev?: string;
  label?: string;
  restorable: boolean;
}

export interface Project {
  id: string;
  name: string;
  modelId: ModelId;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  output: string;
  versions: ProjectVersion[];
  files: ProjectFile[];
}

export interface ProjectFile {
  id: string;
  name: string;
  language: string;
  content: string;
}

export type UserPlan = "free" | "pro" | "team";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  requestsUsed: number;
  requestsLimit: number;
}