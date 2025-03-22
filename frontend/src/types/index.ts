export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
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
