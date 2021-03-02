import { useRouter } from 'next/router'

export default function Transactions() {
  const router = useRouter()
  const { username } = router.query
  return (
    <article>
      <h1>This is the Transactions Page for user {username}</h1>
    </article>
  )
}