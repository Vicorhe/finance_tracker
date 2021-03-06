import Link from 'next/link'

export default function Nav({ title = 'Entries' }) {
  return (
    <nav>
      <div className="">
        <Link href="/">
          <a className="">{title}</a>
        </Link>
      </div>
    </nav>
  )
}
