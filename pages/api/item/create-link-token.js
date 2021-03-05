import client from '../../../lib/plaid'

export default async function handler(_, res) {
  try {
    const response = await client.createLinkToken({
      user: {
        client_user_id: '123-test-user-id',
      },
      client_name: 'Finance Tracker',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    return res.send({link_token: response.link_token}) 
  } catch (err) {
    return res.send({ err: err.message })
  }
}