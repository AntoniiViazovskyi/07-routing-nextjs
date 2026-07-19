import css from '@/app/notes/filter/@sidebar/SidebarNotes.module.css'
import Link from 'next/link'

export default function SidebarNotes() {
  const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']

  function renderTags(tags: string[]) {
    return tags.map((tag) => {
      return (
        <li className={css.menuItem} key={tag}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      )
    })
  }

  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {renderTags(tags)}
    </ul>
  )
}
