import { useMutation, useQueryClient } from '@tanstack/react-query'
import css from '@/components/NoteForm/NoteForm.module.css'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import * as Yup from 'yup'

import { NoteTag } from '@/types/note'
import { createNote } from '@/lib/api'
import Loader from '../Loader/Loader'

interface NoteFormProps {
  closeModal: () => void
}

interface NoteFormValues {
  title: string
  content: string
  tag: NoteTag
}

const TITLE_MIN_LENGTH = 3
const TITLE_MAX_LENGTH = 50
const CONTENT_MAX_LENGTH = 500

const INITIAL_VALUES: NoteFormValues = {
  title: '',
  content: '',
  tag: 'Todo'
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(
      TITLE_MIN_LENGTH,
      `Title should be longer than ${TITLE_MIN_LENGTH} symbols`
    )
    .max(
      TITLE_MAX_LENGTH,
      `Title can't be longer than ${TITLE_MAX_LENGTH} symbols`
    )
    .required('Title is required'),
  content: Yup.string().max(
    CONTENT_MAX_LENGTH,
    `Content can't be longer than ${CONTENT_MAX_LENGTH} symbols`
  ),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required')
})

export default function NoteForm({ closeModal }: NoteFormProps) {
  const queryClient = useQueryClient()
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (values: NoteFormValues) =>
      createNote({
        title: values.title,
        content: values.content,
        tag: values.tag
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  function handleSubmit(
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>
  ) {
    mutate(values, {
      onSuccess: () => {
        actions.resetForm()
        closeModal()
      }
    })
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field as="select" id="tag" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            onClick={() => closeModal()}
            className={css.cancelButton}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}>
            Create note
          </button>
          {isPending && <Loader />}
        </div>
        {isError && (
          <p className={css.error}>Failed to create note. Please try again.</p>
        )}
      </Form>
    </Formik>
  )
}
