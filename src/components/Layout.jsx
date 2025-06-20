// src/components/Layout.jsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Flex, Box } from '@chakra-ui/react'
import Header from './Header'

export default function Layout() {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" overflow="auto">
        <Header />
        <Box p={6}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}