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
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import AddAreaModal from '../components/AddAreaModal'
import AreaMenuButton from '../components/AreaMenuButton'
import utilStyles from '../styles/utils.module.scss'

export default function Areas() {
  const { areas, isError } = useAreas();

  function AreasTable() {
    return (
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
              <Td><AreaMenuButton /></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav title="Areas" notHome>
        <AddAreaModal />
      </Nav>
      {
        isError
          ? LoadingError()
          : !areas
            ? LoadingList()
            : AreasTable()
      }
    </Box>
  );
}