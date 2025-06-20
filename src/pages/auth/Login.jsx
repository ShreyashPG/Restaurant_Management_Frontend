import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack } from '@chakra-ui/react'
import AuthContext from '../../context/AuthContext'
import { useContext } from 'react'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.50">
      <Box w="md" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <Heading mb={6} textAlign="center">Restaurant Login</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </FormControl>
            {error && <Box color="red.500" fontSize="sm">{error}</Box>}
            <Button type="submit" colorScheme="blue" w="full" mt={4}>
              Login
            </Button>
            <Button variant="link" colorScheme="blue" onClick={() => navigate('/signup')}>
              Create new account
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}