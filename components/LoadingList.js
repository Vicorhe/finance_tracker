import { Stack, Skeleton} from "@chakra-ui/react"

export default function LoadingList() {
  return (
    <Stack flex="1" spacing="1rem" overflow="scroll" my="1rem">
      {
        [...Array(8)].map((_, index) => 
          <Skeleton key={index} height="70px" />
        )
      }
    </Stack>
  )
}
