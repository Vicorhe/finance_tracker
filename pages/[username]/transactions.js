import { useContext } from 'react'
import { UserContext } from "../../context"
import Nav from '../../components/Nav'
import { Box } from "@chakra-ui/react"
import utilStyles from '../../styles/utils.module.scss'

export default function Transactions() {
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "transactions", path: `/${user.name}/transactions` }
  ]
  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <h1>This is the Transactions Page for user {user.name}</h1>
    </Box>
  )
}