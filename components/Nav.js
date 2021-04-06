import { forwardRef } from 'react'
import Link from 'next/link'
import {
  Flex, Spacer, Heading, Divider, Icon,
  Breadcrumb, BreadcrumbItem, BreadcrumbLink
} from "@chakra-ui/react"
import { FaHome } from 'react-icons/fa'

const HomeNavIcon = forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      <Icon w={10} h={10} mr="1rem" as={FaHome} _hover={{
        color: "teal"
      }} />
    </a>
  )
})

export default function Nav({ breadcrumbs = [{ name: 'Choose Account', path: '/' }], children }) {
  return (
    <nav>
      <Flex pb="1rem">
        <Link href="/">
          <HomeNavIcon />
        </Link>
        <Breadcrumb>
          {breadcrumbs.map((bc, idx) => {
            return (
              <BreadcrumbItem key={idx}>
                <BreadcrumbLink as={Link} href={bc.path}>
                  <Heading>
                    {bc.name}
                  </Heading>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
        <Spacer />
        {children}
      </Flex>
      <Divider />
    </nav>
  )
}
