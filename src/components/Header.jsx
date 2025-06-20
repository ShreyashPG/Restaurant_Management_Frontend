import { useContext } from 'react'
import { Button, Flex, Box, Text, Avatar, Spacer } from '@chakra-ui/react'
import AuthContext from '../context/AuthContext'

export default function Header() {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A header component that displays the app title and user information.
 * When the user is logged in, it also displays a logout button.
 * @returns {JSX.Element}
 */
/*******  07bf12eb-b5ad-4f55-90f9-fc9855febb4c  *******/  const { user, logout } = useContext(AuthContext)

  return (
    <Box bg="white" px={6} py={4} borderBottom="1px" borderColor="gray.200" boxShadow="sm">
      <Flex align="center">
        <Text fontSize="xl" fontWeight="bold">
          Restaurant Management System
        </Text>
        <Spacer />
        {user && (
          <Flex align="center">
            <Avatar name={user.first_name} size="sm" mr={2} />
            <Text mr={4}>{user.first_name} {user.last_name}</Text>
            <Button colorScheme="red" size="sm" onClick={logout}>
              Logout
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}