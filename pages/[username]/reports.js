import { useContext } from 'react'
import { UserContext } from "../../context"
import Nav from '../../components/Nav'
import { Box } from "@chakra-ui/react"
import utilStyles from '../../styles/utils.module.scss'

export default function Reports() {
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "reports", path: `/${user.name}/reports` }
  ]
  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <h1>This is the Reports Page for user {user.name}</h1>
    </Box>
  )
}