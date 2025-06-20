// Add this at the top of FoodList.jsx
import { Heading } from '@chakra-ui/react'
// src/pages/foods/FoodList.jsx
import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Box, Flex, useToast } from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function FoodList() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const response = await api.get('/foods')
      setFoods(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading foods',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/${id}`)
      toast({
        title: 'Food deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchFoods()
    } catch (error) {
      toast({
        title: 'Error deleting food',
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
        <Heading size="lg">Food Items</Heading>
        <Button as={Link} to="/foods/create" colorScheme="blue">
          Add New Food
        </Button>
      </Flex>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Name</Th>
              <Th>Price</Th>
              <Th>Menu ID</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {foods.map((food) => (
              <Tr key={food._id}>
                <Td>{food.name}</Td>
                <Td>${food.price.toFixed(2)}</Td>
                <Td>{food.menu_id}</Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/foods/${food.food_id}/edit`}
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
                    onClick={() => handleDelete(food.food_id)}
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