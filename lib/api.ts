import axios from "axios";
import type { Note, NoteFormValues } from "@/types/note";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.headers.common["Authorization"] =
   `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`;

interface ApiResponse {
   notes: Note[];
   totalPages: number;
}

export const getNotes = async (
   page: number,
   search: string,
   tag: string,
): Promise<ApiResponse> => {
   const response = await axios.get<ApiResponse>(`/notes`, {
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
   const response = await axios.post<Note>("/notes", newNote);
   return response.data;
};

export const deleteNote = async (noteId: string) => {
   const response = await axios.delete<Note>(`/notes/${noteId}`);
   return response.data;
};

export const getNoteById = async (noteId: string) => {
   const response = await axios.get<Note>(`/notes/${noteId}`);
   return response.data;
};
