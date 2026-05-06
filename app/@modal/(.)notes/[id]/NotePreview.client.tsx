'use client';

import css from './ModalId.module.css';
import { useQuery } from '@tanstack/react-query';
import { getNoteById } from '@/lib/api';
import Loader from '@/app/loading';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import Error from '@/app/error';

type Props = {
  id: string;
};
export default function NotePreviewClient({ id }: Props) {
  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteById(id),
    refetchOnMount: false,
  });
  const router = useRouter();
  const close = () => router.back();

  if (isLoading) return <Loader />;
  if (isError) {
    return <Error error={error} />;
  }
  if (!note) return isError;
  return (
    <Modal onClose={close}>
      <button onClick={close} className={css.backBtn}>
        Close
      </button>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  );
}
