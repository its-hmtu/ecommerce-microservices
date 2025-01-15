import React from 'react'

export const UserContext = React.createContext({})

function UserContextProvider(props: any) {
  const [user, setUser] = React.useState<any>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider