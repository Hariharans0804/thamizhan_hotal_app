import React from 'react'
import Navigators from './src/navigators'
import { MyProvider } from './src/components'

const App = () => {
  return (
    <MyProvider>
      <Navigators />
    </MyProvider>
  )
}

export default App

// const styles = StyleSheet.create({})



