import { fetchNotes } from '@/lib/api'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query'
import NotesClient from './Notes.client'

export default async function Notes() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1],
    queryFn: () => fetchNotes('', 1)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  )
}
