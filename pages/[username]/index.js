import { Box } from "@chakra-ui/react"
import Nav from '../../components/Nav'
import EditUserModal from '../../components/EditUserModal'
import { useContext } from 'react'
import { UserContext } from '../../context'

export default function Account() {
  const { user } = useContext(UserContext)

  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    // Reference this for account sub pages
    // { name: 'Sources', path: `/${user.name}/sources` }
  ]

  return (
    <Box>
      <Nav breadcrumbs={breadcrumbs}>
        <EditUserModal/>
      </Nav>
    </Box>
  )
}