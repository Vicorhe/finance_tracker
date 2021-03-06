import { useRouter } from 'next/router'

export default function Reports() {
  const router = useRouter()
  const { username } = router.query
  return (
    <article>
      <h1>This is the Account Page for user {username}</h1>
    </article>
  )
}