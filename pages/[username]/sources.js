import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { UserContext } from '../../context'
import { Box } from "@chakra-ui/react"
import Nav from '../../components/Nav'
import PlaidLink from "../../components/PlaidLink"

export default function Account() {
  const [token, setToken] = useState(null)
  const [access_token, setAccessToken] = useState(null)
  const { user } = useContext(UserContext)
  const breadcrumbs = [
    { name: user.name, path: `/${user.name}` },
    { name: "Source", path: `/${user.name}/sources` },
    // Reference this for account sub pages
    // { name: 'Sources', path: `/${user.name}/sources` }
  ]

  useEffect(() => {
    createLinkToken()
  }, []);

  async function createLinkToken() {
    const res = await axios.post('http://localhost:3000/api/item/create-link-token');
    const data = res.data.link_token
    setToken(data)
  }

  async function createItem(publicToken) {
    console.log("client side public token", publicToken)
    const res = await axios.post('http://localhost:3000/api/item/create', { publicToken: publicToken, user_id: userId });
    const data = res.data.access_token;
    setAccessToken(data)
  }


  return (
    <Box>
      <Nav breadcrumbs={breadcrumbs}>
      </Nav>
      <h1>Sources Page </h1>
      <div>
        <p>Token: {token}</p>
        <p>Access Token: {access_token}</p>
        {token &&
          <PlaidLink
            token={token}
            accessToken={access_token}
            createItem={createItem}
          />}
      </div>
    </Box>
  )
}