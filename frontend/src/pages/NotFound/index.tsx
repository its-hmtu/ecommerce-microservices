import React from 'react'
import { Link } from 'react-router-dom'
import routes from '../../constants/paths'
import { Result } from 'antd'

function NotFound() {
  return (
    <Result
      title='404'
      status='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Link to={routes.PATHS.HOME} className='font-bold text-xl hover:underline'>
          Back Home
        </Link>
      }
    >
      
    </Result>
  )
}

export default NotFound