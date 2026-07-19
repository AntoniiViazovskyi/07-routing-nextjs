import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client'
import { fetchNoteById } from '@/lib/api'
import {
  QueryClient,
  HydrationBoundary,
  dehydrate
} from '@tanstack/react-query'

interface NoteProps {
  params: Promise<{ id: string }>
}

export default async function NoteDetails({ params }: NoteProps) {
  const { id } = await params

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}
