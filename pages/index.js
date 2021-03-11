import { Flex, Spacer, Box, Heading, Divider, Text, LinkBox } from "@chakra-ui/react"
import { useUsers } from '../lib/swr-hooks'
import AddUserModal from '../components/AddUserModal'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../context'

export default function Home() {
  const { users, isError } = useUsers();
  const { setUser } = useContext(UserContext)

  if (isError) return <div>"An error has occurred.";</div>
  if (!users) return <div> "Loading....";</div>
  return (
    <Box pos="relative" height="100%">
      <Flex pb="1rem">
        <Heading>Choose Account</Heading>
        <Spacer />
        <AddUserModal />
      </Flex>
      <Divider colorScheme="telegram" mb="2rem" />
      <Box>
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
      <LinkBox pos="absolute" bottom="4rem" width="100%">
        <Link href="/areas">
          <Flex
            alignItems="center"
            px="2rem"
            py="1rem"
            border="2px"
            borderColor="gray.900"
            _hover={{
              boxShadow: "12px 12px 2px 1px rgba(0, 0, 255, .2)"
            }}>
            <Text fontSize="4xl">Areas</Text>
            <Spacer />
            <ArrowForwardIcon w={12} h={12} />
          </Flex>
        </Link>
      </LinkBox>
    </Box >

  );
}
