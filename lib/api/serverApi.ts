import { cookies } from "next/headers";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";
import { ApiResponse } from "@/lib/api/clientApi";

export const checkSession = async () => {
   const cookieStore = await cookies();
   const res = await nextServer.get("/auth/session", {
      headers: {
         Cookie: cookieStore.toString(),
      },
   });

   return res;
};

export const getMe = async (): Promise<User> => {
   const cookieStore = await cookies();
   const { data } = await nextServer.get("/users/me", {
      headers: {
         Cookie: cookieStore.toString(),
      },
   });
   return data;
};

export const fetchNoteById = async (id: string) => {
   const cookieStore = await cookies();
   const res = await nextServer.get<Note>(`/notes/${id}`, {
      headers: {
         Cookie: cookieStore.toString(),
      },
   });

   return res.data;
};
export const fetchNotes = async (
   page: number,
   search: string,
   tag: string,
): Promise<ApiResponse> => {
   const cookieStore = await cookies();
   const response = await nextServer.get<ApiResponse>(`/notes`, {
      headers: {
         Cookie: cookieStore.toString(),
      },
      params: {
         page,
         perPage: 12,
         search,
         tag: tag === "all" ? undefined : tag,
      },
   });
   return response.data;
};
