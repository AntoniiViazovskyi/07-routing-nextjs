'use client'

import { fetchNoteById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import css from '@/app/@modal/(.)notes/[id]/NotePreview.module.css'
import Modal from '@/components/Modal/Modal'

export default function NotePreviewClient() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const {
    data: note,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false
  })

  if (isLoading) {
    return <p>Loading, please wait...</p>
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>
  }

  function handleClose() {
    router.back()
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <button className={css.backBtn} onClick={() => router.back()}>
            Back
          </button>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </Modal>
  )
}
