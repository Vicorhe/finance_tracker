import { useState, useEffect } from 'react'
import PlaidLink from './PlaidLink'
import axios from 'axios'

export default function PlaidLinkButton({userId}) {
  const [token, setToken] = useState(null)
  const [access_token, setAccessToken] = useState(null)

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
    <div>
      <p>Token: {token}</p>
      <p>Access Token: {access_token}</p>
      <PlaidLink 
        token={token} 
        accessToken={access_token} 
        createItem={createItem} 
        />
    </div>
  )
}
