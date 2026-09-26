export type MessageRole = "user" | "assistant";

export type Message = {
    id: string;
    role: MessageRole;
    content: string;
    createdAt: number;
};

export type Chat = {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
};