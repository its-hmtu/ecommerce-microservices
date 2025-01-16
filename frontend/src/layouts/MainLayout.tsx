import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <Layout>
      <Layout.Header className='bg-white'>
        <h1>Header</h1>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default MainLayout