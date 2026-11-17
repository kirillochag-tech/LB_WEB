import { useState } from 'react'
import { DELIVERY_ADDRESSES, HOLDINGS, STATUS, fmt } from '../data'
import { orderSum, useStore } from '../store'

// Модальное окно подтверждения отправки заказов в LB
export default function SendModal() {
  const { state, dispatch } = useStore()
  const [addressId, setAddressId] = useState(DELIVERY_ADDRESSES[0].id)
  const [checked, setChecked] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!state.sendModal) return null

  const ready = state.orders.filter(o => o.status === STATUS.FINISHED && !o.deferred)
  const isChecked = (id) => checked[id] !== false // по умолчанию все отмечены
  const selected = ready.filter(o => isChecked(o.id))

  const confirm = () => {
    if (!addressId) { setError('Выберите адрес доставки — поле обязательное (данные из 1С).'); return }
    if (selected.length === 0) { setError('Отмечен хотя бы один заказ для отправки.'); return }
    setSubmitting(true)
    // эмуляция проверки "успешно ли прошла отправка"
    setTimeout(() => {
      dispatch({ type: 'SEND_ORDERS', ids: selected.map(o => o.id), addressId })
      setSubmitting(false)
    }, 700)
  }

  return (
    <div className="modal-backdrop" onClick={() => dispatch({ type: 'CLOSE_SEND_MODAL' })}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>📤 Подтверждение отправки заказов в LB</h3>
        <p className="modal-sub">Все заказы со статусом «Завершен» готовы к отправке. По умолчанию отмечены все — чекбокс можно снять.</p>

        <div className="send-list">
          {ready.map(o => (
            <label key={o.id} className={`send-row ${HOLDINGS[o.holding].colorClass}-soft`}>
              <input type="checkbox" checked={isChecked(o.id)} onChange={() => setChecked(c => ({ ...c, [o.id]: !isChecked(o.id) }))} />
              <span className="send-num">{o.number}</span>
              <span className="chip">{HOLDINGS[o.holding].name}</span>
              <span className="send-count">{o.items.length} поз.</span>
              <b className="send-sum">{fmt(orderSum(o))}</b>
            </label>
          ))}
          {ready.length === 0 && <div className="empty">Нет заказов со статусом «Завершен». Завершите активный заказ кнопкой «Провести заказ».</div>}
        </div>

        {/* Обязательный выбор адреса доставки из 1С */}
        <div className="addr-block">
          <div className="addr-title">🚚 Адрес доставки <span className="req">* обязательно</span> <span className="from1c">список подгружен из 1С</span></div>
          {DELIVERY_ADDRESSES.map(a => (
            <label key={a.id} className={`addr-row ${addressId === a.id ? 'sel' : ''}`}>
              <input type="radio" name="addr" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
              <div>
                <div className="addr-label">{a.label}</div>
                <div className="addr-contact">{a.contact} · {a.hours}</div>
              </div>
            </label>
          ))}
        </div>

        {error && <div className="modal-error">{error}</div>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={() => dispatch({ type: 'CLOSE_SEND_MODAL' })}>Отмена</button>
          <button className="btn btn-primary" disabled={submitting || ready.length === 0} onClick={confirm}>
            {submitting ? '⏳ Отправка…' : `✔ Подтвердить и отправить (${selected.length})`}
          </button>
        </div>
        <p className="hint small">После отправки заказы получат статус «Отправлен» и поступят в 1С на обработку (эмулировать — панель «Демо 1С»).</p>
      </div>
    </div>
  )
}
