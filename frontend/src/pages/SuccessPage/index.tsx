import { Button } from 'antd'
import React from 'react'
import { CiCircleCheck } from 'react-icons/ci'
import { Link } from 'react-router-dom'

function SuccessPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
    }}>
      <CiCircleCheck size={100} color='green' />
      <h1>
        Order placed successfully. Check your email for confirmation.
      </h1>

      <Link to={"/"}>
        <Button type="primary">Back to Home</Button>
      </Link>
    </div>
  )
}

export default SuccessPage