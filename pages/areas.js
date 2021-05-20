import { useState } from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, useDisclosure, IconButton } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
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
  const [selectedArea, setSelectedArea] = useState({})
  const {
    isOpen: isEditAreaOpen,
    onOpen: onEditAreaOpen,
    onClose: onEditAreaClose
  } = useDisclosure()

  const breadcrumbs = [{ name: "Areas", path: "/areas" }]

  function handleSelectArea(a) {
    setSelectedArea(a)
    onEditAreaOpen()
  }

  function AreasSection(input) {
    let label = input ? 'Input' : 'Output'
    return (
      <>
        <Thead backgroundColor="gray.100">
          <Tr>
            <Th>{label} Name</Th>
            <Th>Description</Th>
            <Th>Color</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {areas.filter((a) => !!a.input === input)
            .map((a) => (
              <Tr key={a.id}>
                <Td>{a.name}</Td>
                <Td>{a.description}</Td>
                <Td>
                  <ColorShard color={a.color} center />
                </Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    variant="outline"
                    onClick={() => handleSelectArea(a)}
                  />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </>
    )
  }

  function AreasTable() {
    return (
      <Table variant="simple" size="md">
        {AreasSection(true)}
        {AreasSection(false)}
      </Table>
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <AddArea />
        <EditArea
          area={selectedArea}
          isOpen={isEditAreaOpen}
          onClose={onEditAreaClose}
        />
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