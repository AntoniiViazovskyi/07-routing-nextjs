import axios from 'axios'
import type { Note, NoteTag } from '../types/note'

export interface FetchNotesResponse {
  notes: Note[]
  totalPages: number
}

export interface CreateNoteRequest {
  title: string
  content: string
  tag: NoteTag
}

export async function fetchNotes(
  searchQuery: string = '',
  page: number = 1
): Promise<FetchNotesResponse> {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
  const response = await axios.get<FetchNotesResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        search: searchQuery,
        page: page,
        perPage: 12
      },
      headers: {
        Authorization: `Bearer ${myKey}`
      }
    }
  )
  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
  const response = await axios.get<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      params: {},
      headers: {
        Authorization: `Bearer ${myKey}`
      }
    }
  )
  return response.data
}

export async function createNote({
  title,
  content,
  tag
}: CreateNoteRequest): Promise<Note> {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
  const response = await axios.post<Note>(
    `https://notehub-public.goit.study/api/notes`,
    { title, content, tag },
    {
      headers: {
        Authorization: `Bearer ${myKey}`
      }
    }
  )
  return response.data
}

export async function deleteNote(id: string): Promise<Note> {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${myKey}`
      }
    }
  )
  return response.data
}
