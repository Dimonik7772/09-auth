import { getNoteById } from '@/lib/api';
import NoteDetailsClient from './NoteDetails.client';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await getNoteById(id);
  return {
    title: `Note ${note.title}`,
    description: note.content.slice(0, 50),
    openGraph: {
      title: `Note ${note.title}`,
      description: note.content.slice(0, 50),
      url: `https://notehub.com/notes/${id}`,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Notes',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Note ${note.title}`,
      description: note.content.slice(0, 50),

      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}
const NoteDetails = async (props: NoteDetailsProps) => {
  const queryClient = new QueryClient();

  const { id } = await props.params;
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => getNoteById(id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
};

export default NoteDetails;
