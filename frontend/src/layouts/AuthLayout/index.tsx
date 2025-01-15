import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: "center",
      margin: "0 auto",
      maxWidth: 600,
      height: "100vh",
    }}>
      <Outlet />
    </div>
  )
}

export default AuthLayout