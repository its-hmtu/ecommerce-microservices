import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

function AuthLayout() {
  return (
    <Layout className='min-h-screen bg-gray-200'>
      <Layout.Content className='flex justify-center items-center h-screen'>
        <div className='w-full max-w-md p-4 bg-white rounded-lg shadow-md'>
          <div className='flex justify-left items-center mb-4'>
            <Logo size="text-2xl" underline />
          </div>
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default AuthLayout