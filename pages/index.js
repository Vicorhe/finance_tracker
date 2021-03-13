import { useContext } from 'react'
import { UserContext } from '../context'
import { useUsers } from '../lib/swr-hooks'
import Nav from '../components/Nav'
import AddUserModal from '../components/AddUserModal'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import AreasLink from '../components/AreasLink'
import { Box, Text } from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'

export default function Home() {
  const { users, isError } = useUsers();
  const { setUser } = useContext(UserContext)

  function UsersList(users) {
    return (
      <Box overflowY="scroll" flex="1" my="1rem" className="example">
        {users.map((u) => {
          return (
            <Link key={u.id} href={`/${u.name}`}>
              <Box mb="1rem"
                onClick={() => setUser(u)}
              >
                <Text className={utilStyles.hover_underline_animation} fontSize="4xl">{u.name}</Text>
              </Box>
            </Link>
          )
        })}
      </Box>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav>
        <AddUserModal />
      </Nav>
      {
        isError
          ? LoadingError()
          : !users
            ? LoadingList()
            : UsersList(users)
      }
      <AreasLink />
    </Box>
  );
}
