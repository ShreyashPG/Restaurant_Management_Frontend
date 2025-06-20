import { Box, SimpleGrid, Heading, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import api from '../services/api'

function StatCard({ title, value }) {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      transition="all 0.2s"
    >
      <Text fontSize="md" color="gray.600" fontWeight="medium" mb={2}>
        {title}
      </Text>
      <Text fontSize="3xl" fontWeight="bold" color="blue.600">
        {value}
      </Text>
    </Box>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    foods: 0,
    orders: 0,
    tables: 0,
    revenue: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, ordersRes, tablesRes] = await Promise.all([
          api.get('/foods'),
          api.get('/orders'),
          api.get('/tables'),
        ])
        
        setStats({
          foods: foodsRes.data.length,
          orders: ordersRes.data.length,
          tables: tablesRes.data.length,
          revenue: ordersRes.data.reduce((sum, order) => sum + (order.total || 0), 0),
        })
      } catch (error) {
        alert(`Error loading dashboard data: ${error.message}`)
      }
    }
    
    fetchData()
  }, [])

  return (
    <Box p={6}>
      <Heading size="xl" mb={8} color="gray.700">
        Restaurant Dashboard
      </Heading>
      
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6} mb={10}>
        <StatCard title="Total Menu Items" value={stats.foods} />
        <StatCard title="Active Orders" value={stats.orders} />
        <StatCard title="Available Tables" value={stats.tables} />
        <StatCard title="Today's Revenue" value={`$${stats.revenue.toFixed(2)}`} />
      </SimpleGrid>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4} color="gray.700">
          Recent Activity
        </Heading>
        <Text color="gray.600">All systems operational</Text>
      </Box>
    </Box>
  )
}
