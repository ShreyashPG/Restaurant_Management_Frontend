import { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, Box, Flex, useToast, Heading, Badge } from '@chakra-ui/react'
import { FaEdit, FaTrash, FaFileInvoice } from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/invoices')
      setInvoices(response.data)
      setLoading(false)
    } catch (error) {
      toast({
        title: 'Error loading invoices',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/invoices/${id}`)
      toast({
        title: 'Invoice deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      fetchInvoices()
    } catch (error) {
      toast({
        title: 'Error deleting invoice',
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
        <Heading size="lg">Invoices</Heading>
        <Button as={Link} to="/invoices/create" colorScheme="blue" leftIcon={<FaFileInvoice />}>
          Create Invoice
        </Button>
      </Flex>
      
      <Box bg="white" borderRadius="md" overflow="hidden" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>Invoice ID</Th>
              <Th>Order ID</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Due Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {invoices.map((invoice) => (
              <Tr key={invoice._id}>
                <Td>{invoice.invoice_id}</Td>
                <Td>{invoice.order_id}</Td>
                <Td>${invoice.total?.toFixed(2) || '0.00'}</Td>
                <Td>
                  <Badge 
                    colorScheme={invoice.payment_status === 'PAID' ? 'green' : 'orange'}
                  >
                    {invoice.payment_status}
                  </Badge>
                </Td>
                <Td>{new Date(invoice.payment_due_date).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    as={Link}
                    to={`/invoices/${invoice.invoice_id}/edit`}
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
                    onClick={() => handleDelete(invoice.invoice_id)}
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