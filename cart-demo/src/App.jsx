import { StoreProvider } from './store'
import Header from './components/Header'
import CartPage from './components/CartPage'

export default function App() {
  return (
    <StoreProvider>
      <Header />
      <CartPage />
    </StoreProvider>
  )
}
