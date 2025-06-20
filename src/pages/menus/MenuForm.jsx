import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormControl, FormLabel, Input, Button, Box, Heading, useToast } from '@chakra-ui/react'
import api from '../../services/api'

export default function MenuForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    start_date: '',
    end_date: '',
  })
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (id) {
      const fetchMenu = async () => {
        try {
          const response = await api.get(`/menus/${id}`)
          const menu = response.data
          setFormData({
            name: menu.name,
            category: menu.category,
            start_date: menu.start_date ? new Date(menu.start_date).toISOString().split('T')[0] : '',
            end_date: menu.end_date ? new Date(menu.end_date).toISOString().split('T')[0] : '',
          })
          setLoading(false)
        } catch (error) {
          toast({
            title: 'Error loading menu',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }
      fetchMenu()
    }
  }, [id, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dataToSend = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date) : null,
        end_date: formData.end_date ? new Date(formData.end_date) : null,
      }

      if (id) {
        await api.patch(`/menus/${id}`, dataToSend)
        toast({
          title: 'Menu updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await api.post('/menus', dataToSend)
        toast({
          title: 'Menu created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      navigate('/menus')
    } catch (error) {
      toast({
        title: id ? 'Error updating menu' : 'Error creating menu',
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
      <Heading mb={6}>{id ? 'Edit Menu' : 'Add New Menu'}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl mb={4} isRequired>
          <FormLabel>Category</FormLabel>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl mb={4}>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl mb={4}>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </FormControl>
        
        <Button type="submit" colorScheme="blue" w="full">
          {id ? 'Update Menu' : 'Create Menu'}
        </Button>
      </form>
    </Box>
  )
}