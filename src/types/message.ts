// types/message.ts
export interface Message {
  id: string;
  title?: string;
  content: string;
  createdAt?: Date;
}