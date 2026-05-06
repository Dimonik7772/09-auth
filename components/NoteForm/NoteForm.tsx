"use client";
import css from "./NoteForm.module.css";
import type { NoteFormValues } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Yup from "yup";
import { createNote } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useNoteDraftStore } from "@/lib/store/noteStore";

const NoteFormValidationSchema = Yup.object().shape({
   title: Yup.string()
      .min(3, "Title is too short min 3 chars")
      .max(50)
      .required("This is a required field"),
   content: Yup.string().max(500),
   tag: Yup.string()
      .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
      .required(),
});

export default function NoteForm() {
   const { draft, setDraft, clearDraft } = useNoteDraftStore();
   const handleChange = (
      event: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
   ) => {
      setDraft({
         ...draft,
         [event.target.name]: event.target.value,
      });
   };
   const [errors, setErrors] = useState<Record<string, string>>({});

   const queryClient = useQueryClient();

   const router = useRouter();

   const mutation = useMutation({
      mutationFn: createNote,
   });

   const handleSubmit = async (formData: FormData) => {
      const values: NoteFormValues = {
         title: formData.get("title") as string,
         content: formData.get("content") as string,
         tag: formData.get("tag") as
            | "Todo"
            | "Work"
            | "Personal"
            | "Meeting"
            | "Shopping",
      };

      try {
         setErrors({});

         await NoteFormValidationSchema.validate(values, {
            abortEarly: false,
         });

         mutation.mutate(values, {
            onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ["notes"] });
               clearDraft();
               router.back();
            },
         });
      } catch (err) {
         if (err instanceof Yup.ValidationError) {
            const formattedErrors: Record<string, string> = {};

            err.inner.map((e) => {
               if (e.path) {
                  formattedErrors[e.path] = e.message;
               }
            });

            setErrors(formattedErrors);
         }
      }
   };

   return (
      <form className={css.form} action={handleSubmit}>
         <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
               id="title"
               type="text"
               name="title"
               className={css.input}
               defaultValue={draft?.title}
               onChange={handleChange}
            />

            <span className={css.error}>{errors.title}</span>
         </div>
         <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
               id="content"
               name="content"
               rows={8}
               className={css.textarea}
               onChange={handleChange}
               defaultValue={draft?.content}
            />

            <span className={css.error}>{errors.content}</span>
         </div>
         <div className={css.formGroup}>
            <label htmlFor="tag">tag</label>
            <select
               id="tag"
               name="tag"
               className={css.select}
               onChange={handleChange}
               defaultValue={draft?.tag}
            >
               <option value="Todo">Todo</option>
               <option value="Work">Work</option>
               <option value="Personal">Personal</option>
               <option value="Meeting">Meeting</option>
               <option value="Shopping">Shopping</option>
            </select>
            <span className={css.error}>{errors.tag}</span>
         </div>
         <div className={css.formGroup}>
            <button
               type="button"
               className={css.cancelButton}
               onClick={() => router.back()}
            >
               Cancel
            </button>
            <button type="submit" className={css.submitButton}>
               {mutation.isPending ? "Creating ..." : "Create Note"}
            </button>
         </div>
      </form>
   );
}
