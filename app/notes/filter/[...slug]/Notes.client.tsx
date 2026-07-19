'use client'

import { fetchNotes } from '@/lib/api'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import css from '@/app/notes/filter/[...slug]/Notes.module.css'
import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import Loader from '@/components/Loader/Loader'
import NoteList from '@/components/NoteList/NoteList'
import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'

interface NotesClientProps {
  tag?: string
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const {
    data: { notes, totalPages } = {
      notes: [],
      totalPages: 1
    },
    isPending: isNotesPending,
    isError: isNotesError
  } = useQuery({
    queryKey: ['notes', debouncedSearchQuery, currentPage, tag],
    queryFn: () => fetchNotes(debouncedSearchQuery, currentPage, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false
  })

  const updateSearchQuery = useDebouncedCallback((query: string) => {
    setDebouncedSearchQuery(query.trim())
    setCurrentPage(1)
  }, 500)

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={updateSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => openModal()}>
          Create note +
        </button>
      </header>
      {isNotesPending ? (
        <Loader />
      ) : isNotesError ? (
        <p>Failed to load notes.</p>
      ) : notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p>Sorry, no results matching your filtering criteria</p>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}
    </div>
  )
}
