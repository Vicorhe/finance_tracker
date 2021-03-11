import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex, Spacer, Box, Heading, Divider, Text } from "@chakra-ui/react"
import { ChevronLeftIcon } from '@chakra-ui/icons'
import TransactionsPanel from '../../components/TransactionsPanel'
import Link from 'next/link'
import {useContext} from 'react'
import {UserContext} from '../../context'

export default function Account() {
  const { user } = useContext(UserContext)
  return (
    <Box>
      <Flex pb="1rem">
        <Link href="/">
          <ChevronLeftIcon w={12} h={12} mr="1rem" _hover={{
            color: "teal"
          }} />
        </Link>
        <Heading>{user.name}</Heading>
        <Spacer />
      </Flex>
      <Divider colorScheme="telegram" mb="2rem" />

      <Tabs>
        <TabList>
          <Tab>Sources</Tab>
          <Tab>Transactions</Tab>
          <Tab>Reports</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <TransactionsPanel/>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>

  )
}