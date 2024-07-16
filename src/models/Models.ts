
export interface ModelMessage {
  id: number,
  sender_id: number,
  sender_name: string,
  receiver_id: number,
  message: string,
  chat_list_id: number,
  created_at: string
}

export interface ModelChatList {
  id: number,
  block_user: ModelBlockUser,
  last_message: ModelLast_message,
  chat_with_user: Model_chat_with_user
}

export interface ModelUser{
  id: number,
  name:string,
  image:string,
  created_at:string,
  username:string,
  token:string,
  is_online:boolean,
  last_seen:string
}

interface ModelBlockUser{
  isYouBlocked: boolean,
  isTheyBlocked:boolean,
}

interface ModelLast_message {
  message?: string,
  created_at?: string
}

interface Model_chat_with_user {
  id: number,
  name: string,
  image: string,
  is_online:boolean,
  last_seen:string
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface ModelOnlineStatus {
  id: number,
  isOnline: boolean,
  lastSeen: string
}