import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  FormControl, FormLabel, Input, Button, Select, Box, Heading, useToast, 
  Text, Flex, NumberInput, NumberInputField, NumberInputStepper, 
  NumberIncrementStepper, NumberDecrementStepper 
} from '@chakra-ui/react'
import api from '../../services/api'

export default function InvoiceForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [formData, setFormData] = useState({
    order_id: '',
    payment_method: '',
    payment_status: 'PENDING',
    payment_due_date: '',
    total: 0,
  })
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await api.get('/orders')
        setOrders(ordersRes.data)
        
        if (id) {
          const invoiceRes = await api.get(`/invoices/${id}`)
          setFormData({
            ...invoiceRes.data,
            payment_due_date: invoiceRes.data.payment_due_date 
              ? new Date(invoiceRes.data.payment_due_date).toISOString().split('T')[0] 
              : ''
          })
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

  const handleTotalChange = (value) => {
    setFormData(prev => ({ ...prev, total: parseFloat(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        payment_due_date: formData.payment_due_date ? new Date(formData.payment_due_date) : null,
      }

      if (id) {
        await api.patch(`/invoices/${id}`, dataToSend)
        toast({
          title: 'Invoice updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await api.post('/invoices', dataToSend)
        toast({
          title: 'Invoice created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      navigate('/invoices')
    } catch (error) {
      toast({
        title: id ? 'Error updating invoice' : 'Error creating invoice',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box maxW="2xl" mx="auto">
      <Heading mb={6}>{id ? 'Edit Invoice' : 'Create New Invoice'}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={6} isRequired>
          <FormLabel>Order</FormLabel>
          <Select
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            placeholder="Select order"
          >
            {orders.map(order => (
              <option key={order.order_id} value={order.order_id}>
                Order #{order.order_id} - {new Date(order.order_date).toLocaleDateString()}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <Flex gap={6} mb={6}>
          <FormControl flex="1" isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              placeholder="Select method"
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Credit Card</option>
            </Select>
          </FormControl>
          
          <FormControl flex="1" isRequired>
            <FormLabel>Payment Status</FormLabel>
            <Select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
            >
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
            </Select>
          </FormControl>
        </Flex>
        
        <Flex gap={6} mb={6}>
          <FormControl flex="1">
            <FormLabel>Due Date</FormLabel>
            <Input
              type="date"
              name="payment_due_date"
              value={formData.payment_due_date}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl flex="1" isRequired>
            <FormLabel>Total Amount</FormLabel>
            <NumberInput 
              value={formData.total} 
              onChange={handleTotalChange}
              precision={2}
              min={0}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </Flex>
        
        <Button type="submit" colorScheme="blue" w="full" size="lg">
          {id ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </form>
    </Box>
  )
}