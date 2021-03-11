import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import { useAreas } from '../lib/swr-hooks'
import Nav from '../components/Nav'

export default function Areas() {
  const { areas, isError } = useAreas();
  if (isError) return <div>"An error has occurred.";</div>
  if (!areas) return <div> "Loading....";</div>
  return (
    <Box mb="2rem">
      <Nav title="Areas" notHome></Nav>
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