import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Box, Flex, useToast, Heading, Badge } from '@chakra-ui/react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function TableList() {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchTables()
  }, [])

  const fetchTables = async () => {
    try {
      const response = await api.get('/tables')
      setTables(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading tables',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tables/${id}`)
      toast({
        title: 'Table deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchTables()
    } catch (error) {
      toast({
        title: 'Error deleting table',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const getStatus = (table) => {
    // In a real app, you'd check if the table has active orders
    return Math.random() > 0.5 ? 'Occupied' : 'Available'
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box>
      <Flex justify="space-between" mb={6}>
        <Heading size="lg">Restaurant Tables</Heading>
        <Button as={Link} to="/tables/create" colorScheme="blue" leftIcon={<FaPlus />}>
          Add Table
        </Button>
      </Flex>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Table #</Th>
              <Th>Capacity</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tables.map((table) => (
              <Tr key={table._id}>
                <Td fontWeight="bold">Table {table.table_number}</Td>
                <Td>{table.number_of_guests} guests</Td>
                <Td>
                  <Badge 
                    colorScheme={getStatus(table) === 'Available' ? 'green' : 'red'}
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {getStatus(table)}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/tables/${table.table_id}/edit`}
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
                    onClick={() => handleDelete(table.table_id)}
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