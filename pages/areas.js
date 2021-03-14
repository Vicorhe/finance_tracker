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
import AreaMenuButton from '../components/AreaMenuButton'
import utilStyles from '../styles/utils.module.scss'

export default function Areas() {
  const { areas, isError } = useAreas();
  if (isError) return <div>"An error has occurred.";</div>
  if (!areas) return <div> "Loading....";</div>
  return (
    <Box className={utilStyles.page}>
      <Nav title="Areas" notHome></Nav>
      <Table variant="simple" size="lg">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Color</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.map((a) => (
            <Tr key={a.id}>
              <Td>{a.name}</Td>
              <Td>{a.description}</Td>
              <Td isNumeric>{a.color}</Td>
              <Td><AreaMenuButton/></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}