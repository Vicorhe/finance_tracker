import {
  Flex,
  Spacer,
  Box,
  Heading,
  Divider,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useAreas } from '../lib/swr-hooks'
import Link from 'next/link'

export default function Areas() {
  const { areas, isError } = useAreas();
  if (isError) return <div>"An error has occurred.";</div>
  if (!areas) return <div> "Loading....";</div>
  return (
    <Box mb="2rem">
      <Flex pb="1rem">
        <Link href="/">
          <ChevronLeftIcon w={12} h={12} mr="1rem" _hover={{
            color: "teal"
          }} />
        </Link>
        <Heading>Areas</Heading>
        <Spacer />
      </Flex>
      <Divider colorScheme="telegram" mb="2rem" />
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Color</Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.map((a) => (
            <Tr key={a.id}>
              <Td>{a.name}</Td>
              <Td>{a.description}</Td>
              <Td isNumeric>{a.color}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}