import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Box, Flex, useToast, Heading, Badge } from '@chakra-ui/react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading orders',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`)
      toast({
        title: 'Order deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchOrders()
    } catch (error) {
      toast({
        title: 'Error deleting order',
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
        <Heading size="lg">Orders</Heading>
        <Button as={Link} to="/orders/create" colorScheme="blue">
          Create New Order
        </Button>
      </Flex>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Order ID</Th>
              <Th>Date</Th>
              <Th>Table</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order._id}>
                <Td>{order.order_id}</Td>
                <Td>{new Date(order.order_date).toLocaleString()}</Td>
                <Td>Table {order.table_id}</Td>
                <Td>
                  <Badge colorScheme="green">Active</Badge>
                </Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/orders/${order.order_id}/edit`}
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
                    onClick={() => handleDelete(order.order_id)}
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