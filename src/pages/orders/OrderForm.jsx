import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormControl, FormLabel, Input, Button, Select, Box, Heading, useToast, Textarea } from '@chakra-ui/react'
import api from '../../services/api'

export default function OrderForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [tables, setTables] = useState([])
  const [foods, setFoods] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [formData, setFormData] = useState({
    order_date: new Date().toISOString().slice(0, 16),
    table_id: '',
    notes: '',
  })
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesRes, foodsRes] = await Promise.all([
          api.get('/tables'),
          api.get('/foods'),
        ])
        
        setTables(tablesRes.data)
        setFoods(foodsRes.data)
        
        if (id) {
          const orderRes = await api.get(`/orders/${id}`)
          setFormData({
            order_date: new Date(orderRes.data.order_date).toISOString().slice(0, 16),
            table_id: orderRes.data.table_id,
            notes: orderRes.data.notes || '',
          })
          
          // Fetch order items
          const itemsRes = await api.get(`/orderItems-order/${id}`)
          setOrderItems(itemsRes.data)
        }
        setLoading(false)
      } catch (error) {
        toast({
          title: 'Error loading data',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    
    fetchData()
  }, [id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    setOrderItems([...orderItems, { food_id: '', quantity: 1 }])
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...orderItems]
    newItems[index][field] = value
    setOrderItems(newItems)
  }

  const handleRemoveItem = (index) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const orderData = {
        ...formData,
        order_items: orderItems
      }

      if (id) {
        await api.patch(`/orders/${id}`, orderData)
        toast({
          title: 'Order updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await api.post('/orders', orderData)
        toast({
          title: 'Order created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      navigate('/orders')
    } catch (error) {
      toast({
        title: id ? 'Error updating order' : 'Error creating order',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box maxW="3xl" mx="auto">
      <Heading mb={6}>{id ? 'Edit Order' : 'Create New Order'}</Heading>
      <form onSubmit={handleSubmit}>
        <Flex gap={6} mb={6}>
          <FormControl flex="1" isRequired>
            <FormLabel>Order Date</FormLabel>
            <Input
              type="datetime-local"
              name="order_date"
              value={formData.order_date}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl flex="1" isRequired>
            <FormLabel>Table</FormLabel>
            <Select
              name="table_id"
              value={formData.table_id}
              onChange={handleChange}
              placeholder="Select table"
            >
              {tables.map(table => (
                <option key={table.table_id} value={table.table_id}>
                  Table {table.table_number} ({table.number_of_guests} guests)
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        
        <FormControl mb={6}>
          <FormLabel>Order Notes</FormLabel>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special instructions..."
          />
        </FormControl>
        
        <Heading size="md" mb={4}>Order Items</Heading>
        <Box mb={6}>
          {orderItems.map((item, index) => (
            <Flex key={index} gap={3} mb={3} align="center">
              <FormControl flex="2">
                <Select
                  value={item.food_id}
                  onChange={(e) => handleItemChange(index, 'food_id', e.target.value)}
                  placeholder="Select food item"
                >
                  {foods.map(food => (
                    <option key={food.food_id} value={food.food_id}>
                      {food.name} (${food.price})
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl flex="1">
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                  placeholder="Qty"
                />
              </FormControl>
              
              <Button
                colorScheme="red"
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </Button>
            </Flex>
          ))}
          
          <Button
            colorScheme="green"
            onClick={handleAddItem}
            mt={2}
          >
            Add Item
          </Button>
        </Box>
        
        <Button type="submit" colorScheme="blue" w="full" size="lg">
          {id ? 'Update Order' : 'Create Order'}
        </Button>
      </form>
    </Box>
  )
}