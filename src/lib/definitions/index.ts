export type SessionObject = {
  id: string;
  metadata: SessionMetadataObject
  createdAt: string
}

export type SessionMetadataObject = {
  agent: string
}

export enum TaskStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED"
}

export type TaskObject = {
  content: string
  createdAt: string
  id: string
  status: TaskStatus
  title: string
  updatedAt: string
}