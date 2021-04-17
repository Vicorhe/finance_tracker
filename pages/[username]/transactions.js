import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from "../../context"
import { mutate } from 'swr'
import { useAreas, useTransactions } from "../../lib/swr-hooks"
import Nav from '../../components/Nav'
import { Box, Button, Heading, Text, Flex, Select, IconButton, Badge } from "@chakra-ui/react"
import { EditIcon } from '@chakra-ui/icons'
import ColorShard from '../../components/ColorShard'
import LoadingError from '../../components/LoadingError'
import LoadingList from '../../components/LoadingList'
import utilStyles from '../../styles/utils.module.scss'
const moment = require('moment')

export default function Transactions() {
  const { user } = useContext(UserContext)
  const { areas, isAreasError } = useAreas();
  const { transactions, isTransactionsError } = useTransactions(user.id)
  const [syncing, setSyncing] = useState(false)

  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "transactions", path: `/${user.name}/transactions` }
  ]

  useEffect(() => {
    //syncTransactions() // commented out during development
  }, []);

  function getColorShard(area_id) {
    var color = '#EDEDED'
    if (area_id)
      color = areas.filter(a => a.id == area_id)[0].color
    return <ColorShard color={color} />
  }

  function areaName(area_id) {
    if (!area_id) return 'N/A'
    return areas.filter(a => a.id = area_id)[0]
  }

  async function syncTransactions() {
    setSyncing(true)
    await axios.post('http://localhost:3000/api/transaction/sync', { user_id: user.id });
    mutate(`/api/transaction/get-all?user_id=${user.id}`)
    setSyncing(false)
  }

  function TransactionsTable() {
    return (
      <Box>
        <Flex alignItems="center" p="3">
          <Heading fontSize="lg" mr="3" fontWeight="extrabold">SHOWING</Heading>
          <Select size="md" maxWidth="225px">
            <option value="option1">Unassigned</option>
            <option value="option2">Hidden</option>
            <option value="option3">Cash Transactions</option>
            <option value="option4">Splits</option>
          </Select>
        </Flex>
        {transactions.map(t => (
          <Box key={t.id} pt="4" borderBottom="2px solid">
            <Flex alignItems="center">
              <Text fontSize="xl" width="16%">{moment(t.date).format("MMM DD, YYYY")}</Text>
              <Text fontSize="xl" width="58%">{t.name}</Text>
              <Flex alignItems="center" width="17%">
                {getColorShard(t.area_id)}
                <Text fontSize="lg" pl="3">{areaName(t.area_id)}</Text>
              </Flex>
              <Text fontSize="xl" fontWeight="bold" textAlign="right" width="9%">{t.amount}</Text>
            </Flex>
            <Box py="3" pl="3">
              <Flex alignItems="center" mb="1">
                <Heading fontSize="md" fontWeight="extrabold" mr="2">MEMO</Heading>
                {!!t.split && <Badge variant="subtle" colorScheme="purple" mr="2">Split</Badge>}
                {!!t.hidden && <Badge variant="subtle" colorScheme="gray" mr="2">Hidden</Badge>}
                {!!t.cash && <Badge variant="subtle" colorScheme="green">Cash</Badge>}
              </Flex>
              <Flex alignItems="center">
                <Box flex="1">
                  {
                    !!t.memo 
                      ? <Text fontSize="xl"> {t.memo}</Text>
                      : <Text fontSize="xl" color="#D3D3D3">Edit to add memo...</Text>
                      }
                </Box>
                <IconButton icon={<EditIcon />}
                  size="sm"
                  variant="outline" />
              </Flex>
            </Box>
          </Box>
        ))
        }
      </Box >
    )
  }

  return (
    <Box className={utilStyles.page}>
      <Nav breadcrumbs={breadcrumbs}>
        <Button disabled={syncing} size="lg" onClick={syncTransactions}>
          {syncing ? 'Syncing ...' : 'Sync'}
        </Button>
      </Nav>
      {
        (isTransactionsError || isAreasError)
          ? LoadingError()
          : (!transactions || !areas)
            ? LoadingList()
            : TransactionsTable()
      }
    </Box>
  )
}