import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react"
import TransactionsPanel from '../../components/TransactionsPanel'
import Nav from '../../components/Nav'
import { useContext } from 'react'
import { UserContext } from '../../context'

export default function Account() {
  const { user } = useContext(UserContext)
  return (
    <Box>
      <Nav title={user.name} notHome></Nav>
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
            <TransactionsPanel />
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>

  )
}