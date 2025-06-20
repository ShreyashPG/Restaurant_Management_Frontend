import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormControl, FormLabel, Input, Button, Box, Heading, useToast, NumberInput, NumberInputField } from '@chakra-ui/react'
import api from '../../services/api'

export default function TableForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({
    table_number: '',
    number_of_guests: 2,
  })
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (id) {
      const fetchTable = async () => {
        try {
          const response = await api.get(`/tables/${id}`)
          setFormData({
            table_number: response.data.table_number,
            number_of_guests: response.data.number_of_guests,
          })
          setLoading(false)
        } catch (error) {
          toast({
            title: 'Error loading table',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
      fetchTable()
    }
  }, [id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGuestChange = (value) => {
    setFormData(prev => ({ ...prev, number_of_guests: parseInt(value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await api.patch(`/tables/${id}`, formData)
        toast({
          title: 'Table updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await api.post('/tables', formData)
        toast({
          title: 'Table created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      navigate('/tables')
    } catch (error) {
      toast({
        title: id ? 'Error updating table' : 'Error creating table',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) return <Box>Loading...</Box>

  return (
    <Box maxW="md" mx="auto">
      <Heading mb={6}>{id ? 'Edit Table' : 'Add New Table'}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Table Number</FormLabel>
          <Input
            type="number"
            name="table_number"
            value={formData.table_number}
            onChange={handleChange}
            min="1"
          />
        </FormControl>
        
        <FormControl mb={4} isRequired>
          <FormLabel>Number of Guests</FormLabel>
          <NumberInput 
            value={formData.number_of_guests} 
            onChange={handleGuestChange}
            min={1}
            max={12}
          >
            <NumberInputField />
          </NumberInput>
        </FormControl>
        
        <Button type="submit" colorScheme="blue" w="full">
          {id ? 'Update Table' : 'Create Table'}
        </Button>
      </form>
    </Box>
  )
}