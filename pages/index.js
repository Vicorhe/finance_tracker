import { useContext } from 'react'
import { UserContext } from '../context'
import { useUsers } from '../lib/swr-hooks'
import Nav from '../components/Nav'
import AddUserModal from '../components/AddUserModal'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import { Flex, Spacer, Box, Text, LinkBox} from "@chakra-ui/react"
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.scss'

export default function Home() {
  const { users, isError } = useUsers();
  const { setUser } = useContext(UserContext)

  function UserList(users) {
    return (
      <Box overflowY="scroll" flex="1" my="1rem">
        {users.map((u) => {
          return (
            <Link key={u.id} href={`/${u.name}`}>
              <Box mb="1rem"
                onClick={() => setUser(u)}
              >
                <Text fontSize="4xl">{u.name}</Text>
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
            : UserList(users)
      }
      <LinkBox >
        <Link href="/areas">
          <Flex
            alignItems="center"
            px="2rem"
            py="1rem"
            border="2px"
            borderColor="gray.900"
            _hover={{
              boxShadow: "10px 10px 4px 3px rgba(0, 0, 255, .2)"
            }}>
            <Text fontSize="4xl">Areas</Text>
            <Spacer />
            <ArrowForwardIcon w={12} h={12} />
          </Flex>
        </Link>
      </LinkBox>
    </Box>
  );
}
