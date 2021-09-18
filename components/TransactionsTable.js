import { useEffect, useState } from 'react'
import axios from 'axios'
import { InfiniteLoader, List, AutoSizer } from 'react-virtualized'
import { useDisclosure, Box, Heading, Text, Flex, Badge, IconButton } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import useAreas from '../hooks/areas'
import EditTransaction from '../components/modals/transaction/EditTransaction'
import AddSplitTransactions from '../components/modals/transaction/AddSplitTransactions'
import EditSplitTransactions from '../components/modals/transaction/EditSplitTransactions'
import ColorShard from '../components/ColorShard'
import { formatDisplayDate } from '../utils/date-formatter'
import { getBlankSplit } from '../utils/split-utils'

export default function TransactionsTable({ displayedTransactions, refresh = () => { } }) {
  const { areas } = useAreas();
  const [remoteRowCount, setRemoteRowCount] = useState(0)
  const [transaction, setTransaction] = useState({})
  const [splits, setSplits] = useState([])

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose
  } = useDisclosure()

  const {
    isOpen: isAddSplitsModalOpen,
    onOpen: onAddSplitsModalOpen,
    onClose: onAddSplitsModalClose
  } = useDisclosure()

  const {
    isOpen: isEditSplitsModalOpen,
    onOpen: onEditSplitsModalOpen,
    onClose: onEditSplitsModalClose
  } = useDisclosure()

  useEffect(() => {
    setRemoteRowCount(displayedTransactions.length)
  }, [displayedTransactions])

  function isRowLoaded({ index }) {
    return !!displayedTransactions[index];
  }

  function editTransaction(transaction) {
    setTransaction(transaction)
    if (transaction.split) {
      if (!transaction.parent_id) {
        getSplits(transaction.id)
      } else {
        getTransaction(transaction.parent_id)
        getSplits(transaction.parent_id)
      }
      onEditSplitsModalOpen()
    }
    else {
      onEditModalOpen()
    }
  }

  async function getTransaction(id) {
    try {
      const res = await axios.get(`/api/transaction/get?id=${id}`)
      setTransaction(res.data)
    } catch (e) {
      throw Error(e.message)
    }
  }

  async function getSplits(parent_id) {
    try {
      const res = await axios.get(`/api/split/get-all?parent_id=${parent_id}`)
      setSplits(res.data)
    } catch (e) {
      throw Error(e.message)
    }
  }

  function handleSplit() {
    onEditModalClose()
    setSplits([getBlankSplit()])
    onAddSplitsModalOpen()
  }

  function getColorShard(area_id) {
    var color = '#EDEDED'
    if (area_id)
      color = areas.filter(a => a.id == area_id)[0].color
    return <ColorShard color={color} />
  }

  function areaName(area_id) {
    if (!area_id) return 'Unassigned'
    return areas.filter(a => a.id == area_id)[0].name
  }

  function rowRenderer({ key, index, style }) {
    const displayedRowCount = displayedTransactions.length
    if (index >= displayedRowCount)
      return
    const t = displayedTransactions[index]
    return (
      <Box
        key={key}
        pt="2"
        pr="20px"
        style={style}
      >
        <Flex alignItems="center" pt="3" borderTop="2px solid">
          <Text fontSize="xl" width="16%">{formatDisplayDate(t.date)}</Text>
          <Text fontSize="xl" width="54%" noOfLines={1}>{t.name}</Text>
          <Flex alignItems="center" width="19%" pl={1}>
            {getColorShard(t.area_id)}
            <Text fontSize="lg" pl="3">
              {areaName(t.area_id)}
            </Text>
          </Flex>
          <Text fontSize="xl" fontWeight="bold" textAlign="right" width="11%">${Math.abs(t.amount)}</Text>
        </Flex>
        <Box py="3" pl="3" >
          <Flex alignItems="center" mb="1">
            <Heading fontSize="md" fontWeight="extrabold" mr="2">MEMO</Heading>
            {(!!t.split && !!t.parent_id) && <Badge variant="subtle" colorScheme="purple" mr="2">Split Child</Badge>}
            {(!!t.split && !t.parent_id) && <Badge variant="subtle" colorScheme="purple" mr="2">Split Parent</Badge>}
            {!!t.hidden && <Badge variant="subtle" colorScheme="gray" mr="2">Hidden</Badge>}
            {!!t.manual && <Badge variant="subtle" colorScheme="green">Manual</Badge>}
          </Flex>
          <Flex alignItems="center">
            <Box flex="1">
              {
                !!t.memo
                  ? <Text fontSize="xl"> {t.memo}</Text>
                  : <Text fontSize="xl" color="#D3D3D3">Edit to add memo...</Text>
              }
            </Box>
            <IconButton
              icon={<EditIcon />}
              size="sm"
              variant="outline"
              onClick={() => editTransaction(t)} />
          </Flex>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <EditTransaction
        transaction={transaction}
        isModalOpen={isEditModalOpen}
        onModalClose={onEditModalClose}
        handleSplit={handleSplit}
        refresh={refresh} />
      <AddSplitTransactions
        parent={transaction}
        splits={splits}
        setSplits={setSplits}
        isOpen={isAddSplitsModalOpen}
        onClose={onAddSplitsModalClose}
        refresh={refresh} />
      <EditSplitTransactions
        parent={transaction}
        splits={splits}
        setSplits={setSplits}
        isOpen={isEditSplitsModalOpen}
        onClose={onEditSplitsModalClose}
        refresh={refresh} />
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={() => { }}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {
              ({ width }) => (
                <List
                  height={800}
                  width={width + 20}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={remoteRowCount}
                  rowHeight={130}
                  rowRenderer={rowRenderer}
                />
              )
            }
          </AutoSizer>
        )}
      </InfiniteLoader>
    </>
  )
}