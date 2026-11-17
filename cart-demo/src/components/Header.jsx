import { useState } from 'react'
import { COMPANY } from '../data'
import { useStore } from '../store'

export default function Header() {
  const { state, dispatch } = useStore()
  const [openNtf, setOpenNtf] = useState(false)
  const unread = state.notifications.length

  return (
    <header className="hdr">
      <div className="hdr-left">
        <div className="logo">LB<span>.ru</span></div>
        <nav className="nav">
          <a href="#">Каталог</a>
          <a href="#" className="active">Корзина</a>
          <a href="#">Заказы и документы</a>
          <a href="#">Доставка</a>
        </nav>
      </div>
      <div className="hdr-right">
        <div className="company" title="Контрагент из 1С">
          <div className="company-name">{COMPANY.name}</div>
          <div className="company-sub">ИНН {COMPANY.inn} · менеджер: {COMPANY.manager.name}</div>
        </div>
        <div className="bell-wrap">
          <button className="bell" onClick={() => setOpenNtf(v => !v)} title="Уведомления личного кабинета">
            🔔{unread > 0 && <span className="badge">{unread}</span>}
          </button>
          {openNtf && (
            <div className="ntf-dropdown">
              <div className="ntf-title">Уведомления личного кабинета</div>
              {state.notifications.map(n => (
                <div key={n.id} className="ntf-item">
                  <div className="ntf-date">{n.date}</div>
                  <div>{n.text}</div>
                </div>
              ))}
              {state.notifications.length === 0 && <div className="ntf-empty">Нет новых уведомлений</div>}
            </div>
          )}
        </div>
        <div className="user-chip">👤 Дмитрий Соколов</div>
        <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'RESET_DEMO' })}>↺ Сброс демо</button>
      </div>
    </header>
  )
}
