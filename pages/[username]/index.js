import { useContext, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { UserContext } from '../../context'
import { Box } from "@chakra-ui/react"
import Nav from '../../components/Nav'
import BoxLink from "../../components/BoxLink"
import utilStyles from '../../styles/utils.module.scss'

export default function Account() {
  const { user, setUser } = useContext(UserContext)
  const router = useRouter()
  const { username } = router.query
  const breadcrumbs = [
    { name: username, path: `/${username}` }
  ]

  useEffect(() => {
    pullUser()
  }, [router])

  async function pullUser() {
    if (Object.keys(user).length === 0) {
      const res = await axios.get(`http://localhost:3000/api/user/get?name=${username}`);
      setUser(res.data)
    }
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}></Nav>
      <Box my="1" />
      <BoxLink title="Sources" path={`/${username}/sources`} />
      <BoxLink title="Transactions" path={`/${username}/transactions`} />
      <BoxLink title="Breakdown" path={`/${username}/breakdown`} />
      <BoxLink title="Spending Report" path={`/${username}/reports`} />
    </Box>
  )
}