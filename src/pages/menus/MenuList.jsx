import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Box, Flex, useToast, Heading } from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function MenuList() {
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus')
      setMenus(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading menus',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/menus/${id}`)
      toast({
        title: 'Menu deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchMenus()
    } catch (error) {
      toast({
        title: 'Error deleting menu',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box>
      <Flex justify="space-between" mb={6}>
        <Heading size="lg">Menus</Heading>
        <Button as={Link} to="/menus/create" colorScheme="blue">
          Add New Menu
        </Button>
      </Flex>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {menus.map((menu) => (
              <Tr key={menu._id}>
                <Td>{menu.name}</Td>
                <Td>{menu.category}</Td>
                <Td>{new Date(menu.start_date).toLocaleDateString()}</Td>
                <Td>{new Date(menu.end_date).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/menus/${menu.menu_id}/edit`}
                    icon={<FaEdit />}
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    aria-label="Edit"
                  />
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    aria-label="Delete"
                    onClick={() => handleDelete(menu.menu_id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}