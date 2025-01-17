import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function MainLayout() {
  return (
    <Layout>
      <Layout.Header className='bg-slate-100 shadow-md'>
        <Header isMobile={true}/>
      </Layout.Header>
      <Layout.Content>
        <Outlet />
      </Layout.Content>
    </Layout>
  )
}

export default MainLayout