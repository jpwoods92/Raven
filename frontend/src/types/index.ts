export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  isOnline?: boolean;
  displayname?: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  isPrivate: boolean;
}

export interface Message {
  id: string;
  content: string;
  roomId: string;
  parentMessageId?: string | null;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface RoomMembership {
  id: string;
  roomId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
  user: User;
}

export interface MessageRequest {
  content: string;
  roomId: string;
}

export interface ImportMetaEnv {
  REACT_APP_BACKEND_URL?: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}
