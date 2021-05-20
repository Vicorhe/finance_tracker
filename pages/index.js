import { useContext, useState } from 'react'
import { UserContext } from '../context'
import useSWR from 'swr'
import Nav from '../components/Nav'
import AddUser from '../components/modals/user/AddUser'
import EditUser from '../components/modals/user/EditUser'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import BoxLink from '../components/BoxLink'
import { Box, Flex, Spacer, Text, useDisclosure, IconButton } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'
import fetcher from '../utils/fetcher'

function useUsers() {
  const { data, error } = useSWR(
    "/api/user/get-all",
    fetcher
  );
  return {
    users: data,
    isUsersLoading: !error && !data,
    isUsersError: error,
  }
}

export default function Home() {
  const { users, isUsersError } = useUsers();
  const { setUser } = useContext(UserContext)
  const [selectedUser, setSelectedUser] = useState({ name: '' })
  const {
    isOpen: isEditUserOpen,
    onOpen: onEditUserOpen,
    onClose: onEditUserClose
  } = useDisclosure()

  function handleSelectUser(u) {
    setSelectedUser(u)
    onEditUserOpen()
  }

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
              <IconButton
                icon={<EditIcon />}
                size="sm"
                variant="outline"
                onClick={() => handleSelectUser(u)}
              />
            </Flex>
          )
        })}
      </Box>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav>
        <AddUser />
        <EditUser
          user={selectedUser}
          isOpen={isEditUserOpen}
          onClose={onEditUserClose}
        />
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
