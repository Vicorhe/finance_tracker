import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { useAreas } from '../hooks/swr-hooks'
import Nav from '../components/Nav'
import ColorShard from '../components/ColorShard'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import AddAreaModal from '../components/AddAreaModal'
import EditAreaModal from '../components/EditAreaModal'
import utilStyles from '../styles/utils.module.scss'

export default function Areas() {
  const { areas, isAreasError } = useAreas();

  const breadcrumbs = [{ name: "Areas", path: "/areas" }]

  function AreasTable() {
    return (
      <Table variant="simple" size="md">
        <Thead backgroundColor="gray.100">
          <Tr>
            <Th>Input Name</Th>
            <Th>Description</Th>
            <Th>Color</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.filter((a) => !!a.input)
            .map((a) => (
              <Tr key={a.id}>
                <Td>{a.name}</Td>
                <Td>{a.description}</Td>
                <Td>
                  <ColorShard color={a.color} center />
                </Td>
                <Td>
                  <EditAreaModal area={a} />
                </Td>
              </Tr>
            ))}
        </Tbody>
        <Thead backgroundColor="gray.100">
          <Tr>
            <Th>Output Name</Th>
            <Th>Description</Th>
            <Th>Color</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.filter((a) => !a.input)
            .map((a) => (
              <Tr key={a.id}>
                <Td>{a.name}</Td>
                <Td>{a.description}</Td>
                <Td>
                  <ColorShard color={a.color} center />
                </Td>
                <Td>
                  <EditAreaModal area={a} />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <AddAreaModal />
      </Nav>
      {
        isAreasError
          ? LoadingError()
          : !areas
            ? LoadingList()
            : AreasTable()
      }
    </Box>
  );
}