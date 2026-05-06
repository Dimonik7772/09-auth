"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useRouter } from "next/navigation";

type ModalProps = {
   onClose: () => void;
   children: React.ReactNode;
};
export default function Modal({ onClose, children }: ModalProps) {
   const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
         router.back();
      }
   };
   const router = useRouter();
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            router.back();
         }
      };
      document.addEventListener("keydown", handleKeyDown);
      document.documentElement.style.overflow = "hidden";
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
         document.documentElement.style.overflow = "auto";
      };
   }, [router]);

   return createPortal(
      <div
         className={css.backdrop}
         role="dialog"
         aria-modal="true"
         onClick={handleBackdropClick}
      >
         <div className={css.modal}>{children}</div>
      </div>,
      document.body,
   );
}
