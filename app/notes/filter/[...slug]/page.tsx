import { getNotes } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

type NotesByIdCategoryProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: NotesByIdCategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];

  return {
    title: `Notes by ${tag}`,
    description: `Browse notes filtered by ${tag}`,
    openGraph: {
      title: `Notes by ${tag}`,
      description: `Browse notes by ${tag}`,
      url: `https://notehub.com/notes/filter/${tag}`,
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
      title: `Notes by ${tag}`,
      description: `Browse notes by ${tag}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}
const NotesByCategory = async ({ params }: NotesByIdCategoryProps) => {
  const { slug } = await params;

  const tag = slug[0];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => getNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};
export default NotesByCategory;
