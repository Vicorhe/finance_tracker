import { Flex, Spacer, LinkBox, Text } from "@chakra-ui/react"
import { ArrowForwardIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function BoxLink({ title, path }) {
  return (
    <LinkBox>
      <Link href={path}>
        <Flex
          alignItems="center"
          px="6"
          py="3"
          my="1"
          border="2px"
          _hover={{
            boxShadow: "inset 0 0 0 2px #000",
            transition: "box-shadow 0.15s ease-in"
          }}>
          <Text fontSize="4xl">{title}</Text>
          <Spacer />
          <ArrowForwardIcon w={12} h={12} />
        </Flex>
      </Link>
    </LinkBox>
  )
}
