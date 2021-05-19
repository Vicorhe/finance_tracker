import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import useAreas from '../hooks/areas'
import Nav from '../components/Nav'
import ColorShard from '../components/ColorShard'
import LoadingError from '../components/LoadingError'
import LoadingList from '../components/LoadingList'
import AddArea from '../components/modals/area/AddArea'
import EditArea from '../components/modals/area/EditArea'
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
                  <EditArea area={a} />
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
                  <EditArea area={a} />
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
        <AddArea />
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