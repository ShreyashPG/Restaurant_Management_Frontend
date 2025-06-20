import { Heading, Table, Thead, Tr, Th, Td, Button, IconButton, Box, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function FoodList() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      const response = await api.get('/foods')
      setFoods(response.data)
      setLoading(false)
    } catch (error) {
      alert(`Error loading foods: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/${id}`)
      alert('Food deleted successfully')
      fetchFoods()
    } catch (error) {
      alert(`Error deleting food: ${error.message}`)
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
          <tbody>
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
          </tbody>
        </Table>
      </Box>
    </Box>
  )
}
