// src/pages/Dashboard.jsx
import { Box, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import api from '../services/api'

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
          revenue: ordersRes.data.reduce((sum, order) => sum + order.total, 0),
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <Box>
      <SimpleGrid columns={4} spacing={6} mb={8}>
        <StatCard title="Total Foods" value={stats.foods} />
        <StatCard title="Active Orders" value={stats.orders} />
        <StatCard title="Available Tables" value={stats.tables} />
        <StatCard title="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} />
      </SimpleGrid>
      {/* Additional dashboard components can be added here */}
    </Box>
  )
}

function StatCard({ title, value }) {
  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="md">
      <Stat>
        <StatLabel fontWeight="medium" color="gray.600">
          {title}
        </StatLabel>
        <StatNumber fontSize="3xl" fontWeight="bold">
          {value}
        </StatNumber>
      </Stat>
    </Box>
  )
}