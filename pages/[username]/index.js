import { Box } from "@chakra-ui/react"
import Nav from '../../components/Nav'
import { useContext } from 'react'
import { UserContext } from '../../context'

export default function Account() {
  const { user } = useContext(UserContext)
  return (
    <Box>
      <Nav title={user.name} notHome></Nav>
    </Box>

  )
}