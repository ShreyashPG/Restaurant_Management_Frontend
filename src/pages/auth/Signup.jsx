import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, FormControl, FormLabel, Input, Heading, VStack, Text, Link } from '@chakra-ui/react'
import AuthContext from '../../context/AuthContext'
import { useContext } from 'react'

export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signup } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup({ 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        password, 
        phone 
      })
      navigate('/')
    } catch (err) {
      setError('Failed to create account. Please try again.')
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" h="100vh" bg="gray.50">
      <Box w="md" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <Heading mb={6} textAlign="center">Create Account</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Flex gap={4} w="full">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </FormControl>
            </Flex>
            
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>
            
            {error && <Box color="red.500">{error}</Box>}
            
            <Button type="submit" colorScheme="blue" w="full" mt={4}>
              Sign Up
            </Button>
            
            <Text mt={4}>
              Already have an account?{' '}
              <Link color="blue.500" onClick={() => navigate('/login')}>
                Log in
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}