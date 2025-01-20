import { useQuery } from '@tanstack/react-query'
import React from 'react'
import productService from '../../features/services/product.service'

function HomePage() {
  const {data} = useQuery({
    queryKey: ['user'],
    queryFn: productService.getProducts
  })

  return (
    <div className=''>
      <h1 className='text-2xl font-bold'>Home Page</h1>
      <div>
        {data?.map((product: any) => (
          <div key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage