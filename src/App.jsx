// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import FoodList from './pages/foods/FoodList'
import FoodForm from './pages/foods/FoodForm'
import MenuList from './pages/menus/MenuList'
import MenuForm from './pages/menus/MenuForm'
import OrderList from './pages/orders/OrderList'
import OrderForm from './pages/orders/OrderForm'
import TableList from './pages/tables/TableList'
import TableForm from './pages/tables/TableForm'
import InvoiceList from './pages/invoices/InvoiceList'
import InvoiceForm from './pages/invoices/InvoiceForm'
import UserList from './pages/users/UserList'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ProtectedRoute from './components/ProtectedRoute'
import AuthContextProvider from './context/AuthContext'

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/foods">
            <Route index element={<FoodList />} />
            <Route path="create" element={<FoodForm />} />
            <Route path=":id/edit" element={<FoodForm />} />
          </Route>
          
          <Route path="/menus">
            <Route index element={<MenuList />} />
            <Route path="create" element={<MenuForm />} />
            <Route path=":id/edit" element={<MenuForm />} />
          </Route>
          
          <Route path="/orders">
            <Route index element={<OrderList />} />
            <Route path="create" element={<OrderForm />} />
            <Route path=":id/edit" element={<OrderForm />} />
          </Route>
          
          <Route path="/tables">
            <Route index element={<TableList />} />
            <Route path="create" element={<TableForm />} />
            <Route path=":id/edit" element={<TableForm />} />
          </Route>
          
          <Route path="/invoices">
            <Route index element={<InvoiceList />} />
            <Route path="create" element={<InvoiceForm />} />
            <Route path=":id/edit" element={<InvoiceForm />} />
          </Route>
          
          <Route path="/users">
            <Route index element={<UserList />} />
          </Route>
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}

export default App