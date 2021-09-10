import { Box } from "@chakra-ui/react"
import Nav from '../components/Nav'
import BoxLink from "../components/BoxLink"
import utilStyles from '../styles/utils.module.scss'

export default function Account() {
  return (
    <Box className={utilStyles.page}>
      <Nav />
      <Box my="1" />
      <BoxLink title="Transactions" path={"/transactions"} />
      <BoxLink title="Spending Report" path={"/report"} />
      <BoxLink title="Breakdown" path={"/breakdown"} />
      <BoxLink title="Sources" path={"/sources"} />
      <BoxLink title="Areas" path="/areas" />
    </Box>
  )
}