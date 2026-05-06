import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Create Your Note',
  description: 'Create Your Note',
  openGraph: {
    title: 'Create Your Note',
    description: 'Create Your Note',
    url: 'https://notehub.com/notes/action/create',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Note',
    description: 'Create Your Note',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};
export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
