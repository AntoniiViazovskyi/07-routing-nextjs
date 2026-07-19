import type { Note } from '../../types/note'
import css from '@/components/NoteList/NoteList.module.css'
import { deleteNote } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'

interface NoteListProps {
  notes: Note[]
}

function renderCards(
  notes: Note[],
  onSelect: (id: string) => void,
  isDeleting: boolean
) {
  return notes.map((note) => {
    return (
      <li key={note.id} className={css.listItem}>
        <h2 className={css.title}>{note.title}</h2>
        <p className={css.content}>{note.content}</p>
        <div className={css.footer}>
          <span className={css.tag}>{note.tag}</span>
          <Link className={css.link} href={`/notes/${note.id}`}>
            View details
          </Link>
          <button
            className={css.button}
            onClick={() => onSelect(note.id)}
            disabled={isDeleting}>
            Delete
          </button>
        </div>
      </li>
    )
  })
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient()
  const {
    mutate: removeNote,
    isPending: isDeleting,
    isError: isDeleteError
  } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  return (
    <>
      <ul className={css.list}>{renderCards(notes, removeNote, isDeleting)}</ul>
      {isDeleteError && <p>Failed to delete note.</p>}
    </>
  )
}
