import { Flex, Spacer, Box, Heading, Divider, Container, Text, LinkBox, LinkOverlay } from "@chakra-ui/react"
import { useUsers } from '../lib/swr-hooks'
import AddUserModal from '../components/AddUserModal'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function Home() {
  const { users, isError } = useUsers();
  if (isError) return <div>"An error has occurred.";</div>
  if (!users) return <div> "Loading....";</div>
  return (
    <Container maxW="container.xl">
      <Box px="2rem" pt="1rem">
        <Flex pb="1rem">
          <Heading>Choose Account</Heading>
          <Spacer />
          <AddUserModal />
        </Flex>
        <Divider colorScheme="telegram" mb="2rem" />
        <Box height="450px" overflowY="scroll">
          {users.map((u) => (
            <Box key={u.id} pb="1rem">
              <Text fontSize="4xl">{u.name}</Text>
            </Box>
          ))}
        </Box>
        <LinkBox>
          <Link href="/areas">
            <Flex
              alignItems="center"
              mt="2rem"
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
      </Box>
    </Container>
  );
}
