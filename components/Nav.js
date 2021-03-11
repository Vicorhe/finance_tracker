import { Flex, Spacer, Heading, Divider} from "@chakra-ui/react"
import { ChevronLeftIcon } from '@chakra-ui/icons'
import Link from 'next/link'

export default function Nav({ title = 'Choose Account', notHome = false, backLink = '/' ,children }) {
  return (
    <nav>
      <Flex pb="1rem">
        {notHome &&
          <Link href={backLink}>
            <ChevronLeftIcon w={12} h={12} mr="1rem" _hover={{
              color: "teal"
            }} />
          </Link>
        }
        <Heading>{title}</Heading>
        <Spacer />
        {children}
      </Flex>
      <Divider mb="2rem" />
    </nav>
  )
}
