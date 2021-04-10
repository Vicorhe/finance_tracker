import { Box } from "@chakra-ui/react"
import Nav from '../../components/Nav'
import { useContext } from 'react'
import { UserContext } from '../../context'
import BoxLink from "../../components/BoxLink"
import utilStyles from '../../styles/utils.module.scss'

export default function Account() {
  const { user } = useContext(UserContext)

  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` }
  ]

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <BoxLink title="Sources" path={`/${user.name}/sources`} />
      <BoxLink title="Transactions" path={`/${user.name}/transactions`} />
      <BoxLink title="Reports" path={`/${user.name}/reports`} />
    </Box>
  )
}