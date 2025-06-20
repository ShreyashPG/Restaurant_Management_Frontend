// src/components/Header.jsx
import { useContext } from 'react'
import { Button, Flex, Box, Text, Avatar } from '@chakra-ui/react'
import AuthContext from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <Box bg="white" px={6} py={4} borderBottom="1px" borderColor="gray.200">
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Restaurant Management System
        </Text>
        <Flex align="center">
          <Avatar name={user?.first_name} size="sm" mr={2} />
          <Text mr={4}>{user?.first_name} {user?.last_name}</Text>
          <Button colorScheme="red" size="sm" onClick={logout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}