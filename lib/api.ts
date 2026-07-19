import axios from 'axios'
import type { Note, NoteTag } from '../types/note'

const noteHubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
  }
})

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
  page: number = 1,
  tag?: string
): Promise<FetchNotesResponse> {
  const response = await noteHubApi.get<FetchNotesResponse>('/notes', {
    params: {
      search: searchQuery,
      page,
      tag,
      perPage: 12
    }
  })

  return {
    notes: response.data.notes,
    totalPages: response.data.totalPages
  }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await noteHubApi.get<Note>(`/notes/${id}`)

  return response.data
}

export async function createNote({
  title,
  content,
  tag
}: CreateNoteRequest): Promise<Note> {
  const response = await noteHubApi.post<Note>('/notes', {
    title,
    content,
    tag
  })

  return response.data
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await noteHubApi.delete<Note>(`/notes/${id}`)

  return response.data
}
