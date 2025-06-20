// src/pages/foods/FoodForm.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FormControl, FormLabel, Input, Button, Select, Box, Heading, useToast } from '@chakra-ui/react'
import api from '../../services/api'

export default function FoodForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [menus, setMenus] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    food_image: '',
    menu_id: '',
  })
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menusRes = await api.get('/menus')
        setMenus(menusRes.data)
        
        if (id) {
          const foodRes = await api.get(`/foods/${id}`)
          setFormData({
            name: foodRes.data.name,
            price: foodRes.data.price,
            food_image: foodRes.data.food_image,
            menu_id: foodRes.data.menu_id,
          })
          setLoading(false)
        }
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await api.patch(`/foods/${id}`, formData)
        toast({
          title: 'Food updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await api.post('/foods', formData)
        toast({
          title: 'Food created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      navigate('/foods')
    } catch (error) {
      toast({
        title: id ? 'Error updating food' : 'Error creating food',
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
      <Heading mb={6}>{id ? 'Edit Food' : 'Add New Food'}</Heading>
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
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl mb={4}>
          <FormLabel>Image URL</FormLabel>
          <Input
            name="food_image"
            value={formData.food_image}
            onChange={handleChange}
          />
        </FormControl>
        
        <FormControl mb={4} isRequired>
          <FormLabel>Menu</FormLabel>
          <Select
            name="menu_id"
            value={formData.menu_id}
            onChange={handleChange}
            placeholder="Select menu"
          >
            {menus.map(menu => (
              <option key={menu.menu_id} value={menu.menu_id}>
                {menu.name}
              </option>
            ))}
          </Select>
        </FormControl>
        
        <Button type="submit" colorScheme="blue" w="full">
          {id ? 'Update Food' : 'Create Food'}
        </Button>
      </form>
    </Box>
  )
}