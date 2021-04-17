import { Box } from "@chakra-ui/react"

export default function ColorShard({ color, center }) {
  return (
    <Box
      width="20px"
      height="20px"
      margin={center ? "auto" : ""}
      backgroundColor={color} />
  )
}