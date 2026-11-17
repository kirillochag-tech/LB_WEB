import { useState } from 'react'
import CatalogStrip from './CatalogStrip'
import CollapsiblePanels from './CollapsiblePanels'
import DemoToolbar from './DemoToolbar'
import HoldingColumn from './HoldingColumn'
import SendModal from './SendModal'
import SideBlocks from './SideBlocks'
import { useStore } from '../store'

export default function CartPage() {
  const { state, dispatch } = useStore()
  // Мобильный режим: переключение холдингов (вкладки) вместо двух колонок
  const [mobileTab, setMobileTab] = useState('stroy')

  return (
    <main className="page">
      <div className="page-title-row">
        <h1>🛒 Корзина покупателя</h1>
        <span className="crumbs">Личный кабинет · {state.orders.length} заказов</span>
      </div>

      {state.toast && (
        <div className="toast" onClick={() => dispatch({ type: 'CLEAR_TOAST' })}>ℹ️ {state.toast}</div>
      )}

      <DemoToolbar />
      <CollapsiblePanels />
      <CatalogStrip />

      {/* Переключатель для мобильных */}
      <div className="mobile-tabs">
        <button className={mobileTab === 'stroy' ? 'on tab-stroy' : ''} onClick={() => setMobileTab('stroy')}>🏗 Стройка</button>
        <button className={mobileTab === 'home' ? 'on tab-home' : ''} onClick={() => setMobileTab('home')}>🏠 Home (ОХ)</button>
      </div>

      <div className="cart-layout">
        <div className={`holdings-grid ${mobileTab === 'home' ? 'show-home' : 'show-stroy'}`}>
          <HoldingColumn holding="stroy" />
          <HoldingColumn holding="home" />
        </div>
        <aside className="cart-side"><SideBlocks /></aside>
      </div>

      <footer className="foot">
        Демо интерфейса для сотрудников. Данные сгенерированы; интеграции с 1С/LB/ARM логиста смоделированы кнопками демо-панели.
      </footer>

      <SendModal />
    </main>
  )
}
