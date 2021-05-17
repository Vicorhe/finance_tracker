import { useContext } from 'react'
import { UserContext } from '../context'
import { useUsers } from '../hooks/swr-hooks'
import Nav from '../components/Nav'
import AddUserModal from '../components/AddUserModal'
import EditUserModal from '../components/EditUserModal'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import BoxLink from '../components/BoxLink'
import { Box, Flex, Spacer, Text } from "@chakra-ui/react"
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'

export default function Home() {
  const { users, isUsersError } = useUsers();
  const { setUser } = useContext(UserContext)

  function UsersList(users) {
    return (
      <Box overflowY="scroll" flex="1" my="1rem" className="example">
        {users.map((u) => {
          return (
            <Flex key={u.id} p="2"
              onClick={() => setUser(u)}
            >
              <Link href={`/${u.name}`}>
                <Text className={utilStyles.hover_underline_animation} fontSize="4xl">{u.name}</Text>
              </Link>
              <Spacer />
              <EditUserModal user={u} />
            </Flex>
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
        isUsersError
          ? LoadingError()
          : !users
            ? LoadingList()
            : UsersList(users)
      }
      <BoxLink title="Areas" path="/areas" />
    </Box>
  );
}
