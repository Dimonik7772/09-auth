import type { Note, NoteFormValues } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

// axios.defaults.baseURL = "http://localhost:3000";
// api.defaults.headers.common["Authorization"] =
//    `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

export interface ApiResponse {
   notes: Note[];
   totalPages: number;
}
export type RegisterRequest = {
   email: string;
   password: string;
};

export type LoginRequest = {
   email: string;
   password: string;
};

type CheckSessionRequest = {
   success: boolean;
};

export type UpdateUserRequest = {
   username?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {
   const res = await nextServer.patch<User>("/users/me", payload);
   return res.data;
};

export const logout = async (): Promise<void> => {
   await nextServer.post("/auth/logout");
};

export const getMe = async () => {
   const { data } = await nextServer.get<User>("/users/me");
   return data;
};

export const checkSession = async () => {
   const response = await nextServer.get<CheckSessionRequest>("/auth/session");
   return response.data.success;
};

export const login = async (data: LoginRequest) => {
   const response = await nextServer.post<User>("/auth/login", data);
   return response.data;
};

export const register = async (data: RegisterRequest) => {
   const res = await nextServer.post<User>("/auth/register", data);
   return res.data;
};

export const getNotes = async (
   page: number,
   search: string,
   tag: string,
): Promise<ApiResponse> => {
   const response = await nextServer.get<ApiResponse>(`/notes`, {
      params: {
         page,
         perPage: 12,
         search,
         tag: tag === "all" ? undefined : tag,
      },
   });
   return response.data;
};

export const createNote = async (newNote: NoteFormValues) => {
   const response = await nextServer.post<Note>("/notes", newNote);
   return response.data;
};

export const deleteNote = async (id: string) => {
   const response = await nextServer.delete<Note>(`/notes/${id}`);
   return response.data;
};

export const fetchNoteById = async (id: string) => {
   const response = await nextServer.get<Note>(`/notes/${id}`);

   return response.data;
};
