// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { Box, VStack, Link, Text } from '@chakra-ui/react'

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Foods', path: '/foods' },
  { name: 'Menus', path: '/menus' },
  { name: 'Orders', path: '/orders' },
  { name: 'Tables', path: '/tables' },
  { name: 'Invoices', path: '/invoices' },
  { name: 'Users', path: '/users' },
]

export default function Sidebar() {
  return (
    <Box w="250px" bg="gray.800" color="white" p={4} h="100vh">
      <Text fontSize="xl" fontWeight="bold" mb={8} px={4}>
        Restaurant Manager
      </Text>
      <VStack align="stretch" spacing={1}>
        {navItems.map((item) => (
          <NavLink to={item.path} key={item.path}>
            {({ isActive }) => (
              <Link
                px={4}
                py={2}
                borderRadius="md"
                bg={isActive ? 'blue.500' : 'transparent'}
                _hover={{ bg: 'gray.700' }}
              >
                {item.name}
              </Link>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  )
}