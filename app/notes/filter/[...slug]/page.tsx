import { fetchNotes } from '@/lib/api'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import NotesClient from './Notes.client'

interface NotesPageProps {
  params: Promise<{ slug: string[] }>
}

export default async function Notes({ params }: NotesPageProps) {
  const { slug } = await params
  const selectedTag = slug[0] === 'all' ? undefined : slug[0]

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, selectedTag],
    queryFn: () => fetchNotes('', 1, selectedTag)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={selectedTag} />
    </HydrationBoundary>
  )
}
