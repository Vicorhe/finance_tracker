export default function validUserName(username) {
  return /^[a-z0-9]{2,17}$/.test(username)
}