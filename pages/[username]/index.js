import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Text } from "@chakra-ui/react"
import TransactionsPanel from '../../components/TransactionsPanel'
import Nav from '../../components/Nav'
import { useContext } from 'react'
import { UserContext } from '../../context'

export default function Account() {
  const { user } = useContext(UserContext)
  return (
    <Box>
      <Nav title={user.name} notHome></Nav>
      <Tabs size="lg" variant="enclosed-colored">
        <TabList>
          <Tab>
            <Text fontSize="2xl">Transactions</Text>
          </Tab>
          <Tab>Reports</Tab>
          <Tab>Sources</Tab>

        </TabList>

        <TabPanels>
          <TabPanel>
            <TransactionsPanel />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>

          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>

  )
}