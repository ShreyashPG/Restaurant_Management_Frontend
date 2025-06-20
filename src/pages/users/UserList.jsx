import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Box, Heading, useToast, Avatar, Badge, Flex } from '@chakra-ui/react'
import api from '../../services/api'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading users',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const getRoleBadge = (email) => {
    return email === 'admin@restaurant.com' 
      ? <Badge colorScheme="red">Admin</Badge> 
      : <Badge colorScheme="blue">Staff</Badge>
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box>
      <Heading mb={6}>System Users</Heading>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>User</Th>
              <Th>Contact</Th>
              <Th>Role</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Flex align="center">
                    <Avatar name={`${user.first_name} ${user.last_name}`} size="sm" mr={3} />
                    <Box>
                      <Text fontWeight="medium">{user.first_name} {user.last_name}</Text>
                      <Text fontSize="sm" color="gray.500">@{user.email.split('@')[0]}</Text>
                    </Box>
                  </Flex>
                </Td>
                <Td>
                  <Text>{user.email}</Text>
                  <Text fontSize="sm" color="gray.500">{user.phone}</Text>
                </Td>
                <Td>
                  {getRoleBadge(user.email)}
                </Td>
                <Td>
                  <Badge colorScheme="green">Active</Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}