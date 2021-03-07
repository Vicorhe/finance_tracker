import {
  Flex,
  Spacer,
  Box,
  Heading,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useTransactions } from '../lib/swr-hooks'
import Link from 'next/link'

export default function Areas() {
  const { transactions, isError } = useTransactions(1);
  if (isError) return <div>"An error has occurred.";</div>
  if (!transactions) return <div> "Loading....";</div>
  return (
    <Box mb="2rem">
      <Flex pb="1rem">
        <Link href="/">
          <ChevronLeftIcon w={12} h={12} mr="1rem" _hover={{
            color: "teal"
          }} />
        </Link>
        <Heading>Transactions</Heading>
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
          {transactions.map((t) => (
            <Tr key={t.id}>
              <Td>{t.name}</Td>
              <Td >{t.date}</Td>
              <Td isNumeric>{t.amount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}