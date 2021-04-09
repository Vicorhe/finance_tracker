import styles from './hello-world.module.scss'
import { useState, useEffect } from 'react'
import Link from './Link'
import axios from 'axios'

export default function HelloWorld() {
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

  async function getAccessToken(publicToken) {
    console.log("client side public token", publicToken)
    const res = await axios.post('http://localhost:3000/api/item/get-access-token', { publicToken: publicToken, user_id: 1 });
    const data = res.data.access_token;
    setAccessToken(data)
  }

  return (
    <div className={styles.hello}>
      <p>Token: {token}</p>
      <p>Access Token: {access_token}</p>
      <Link 
        token={token} 
        accessToken={access_token} 
        getAccessToken={getAccessToken} 
        />
    </div>
  )
}
