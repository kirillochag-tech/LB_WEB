import { useState } from 'react'
import { COMPANY, HOLDINGS, STATUS, fmt } from '../data'
import { orderSum, useStore } from '../store'

const statusClass = (s) => ({
  [STATUS.ACTIVE]: 'st-active',
  [STATUS.FINISHED]: 'st-finished',
  [STATUS.SENT]: 'st-sent',
  [STATUS.NEED_APPROVE]: 'st-need',
  [STATUS.APPROVED]: 'st-approved',
  [STATUS.IN_ASSEMBLY]: 'st-assembly',
  [STATUS.ASSEMBLED]: 'st-assembled',
}[s] || 'st-active')

export default function OrderCard({ order }) {
  const { state, dispatch } = useStore()
  const [showComments, setShowComments] = useState(false)
  const collapsed = !!state.collapsed[order.id]
  const toggleCollapse = () => dispatch({ type: 'SET_COLLAPSED', id: order.id, val: !collapsed })

  const h = HOLDINGS[order.holding]
  const sum = orderSum(order)
  const base = order.items.reduce((s, it) => s + it.price * it.qty, 0)
  const editable = order.status === STATUS.ACTIVE
  const deletable = [STATUS.ACTIVE, STATUS.FINISHED].includes(order.status) && !order.deferred
  const mergeSel = state.mergeMode && order.status === STATUS.FINISHED && !order.deferred

  return (
    <article className={`order-card ${h.colorClass} ${order.deferred ? 'deferred' : ''}`}>
      {/* Шапка карточки */}
      <div className="oc-head" onClick={toggleCollapse} style={{ cursor: 'pointer' }}>
        <div className="oc-title">
          {mergeSel && (
            <input type="checkbox" className="merge-check" checked={state.mergeSel.includes(order.id)}
              onClick={e => e.stopPropagation()}
              onChange={() => dispatch({ type: 'TOGGLE_MERGE_SEL', id: order.id })} />
          )}
          <span className="oc-num">{order.number}</span>
          <span className={`status ${statusClass(order.status)}`}>{order.status}</span>
          {order.deferred && <span className="status st-deferred">⏸ Отложен («подумаю»)</span>}
          {order.invoice && <span className="chip chip-invoice">📄 счёт {order.invoice.number}</span>}
        </div>
        <div className="oc-sum">{collapsed ? <b>{fmt(sum)}</b> : null}</div>
        <div className="oc-chev">{collapsed ? '▸' : '▾'}</div>
      </div>

      {!collapsed && (
        <>
          <div className="oc-meta">
            <span>Юрлицо: <b>{h.legalEntity}</b></span>
            <span>Создан: {order.createdAt}, сотр. <b>{order.createdBy}</b></span>
            <span>Позиций: {order.items.length}</span>
          </div>

          {/* Товары */}
          <table className="items">
            <thead>
              <tr><th>Товар</th><th>Цена</th><th>Кол-во</th><th>Сумма</th><th /></tr>
            </thead>
            <tbody>
              {order.items.map(it => (
                <tr key={it.id}>
                  <td className="it-name"><span className="it-emoji">{it.emoji}</span> {it.name}<div className="it-sku">{it.sku}</div></td>
                  <td>{fmt(it.price)}<div className="it-unit">/{it.unit}</div></td>
                  <td>
                    {editable ? (
                      <div className="qty">
                        <button onClick={() => dispatch({ type: 'SET_QTY', itemId: it.id, qty: it.qty - 1 })}>−</button>
                        <span>{it.qty}</span>
                        <button onClick={() => dispatch({ type: 'SET_QTY', itemId: it.id, qty: it.qty + 1 })}>＋</button>
                      </div>
                    ) : <span>{it.qty} {it.unit}</span>}
                  </td>
                  <td className="it-sum">{fmt(it.price * it.qty)}</td>
                  <td>{editable && <button className="x" title="Удалить позицию" onClick={() => dispatch({ type: 'REMOVE_ITEM', itemId: it.id })}>✕</button>}</td>
                </tr>
              ))}
              {order.items.length === 0 && <tr><td colSpan="5" className="empty">Пустой заказ — добавьте товары из каталога</td></tr>}
            </tbody>
          </table>

          {/* Итоги + бонусы */}
          <div className="oc-totals">
            <div className="totals-lines">
              <div>Товары: <b>{fmt(base)}</b></div>
              {order.bonusApplied > 0 && <div className="bonus-line">Списано бонусами: −{fmt(order.bonusApplied)} <span className="bonus-note">(не более {COMPANY.bonuses.maxSharePercent}% суммы)</span></div>}
              <div className="grand">Итого к счёту: <b>{fmt(sum)}</b></div>
            </div>
            {(editable || order.status === STATUS.FINISHED) && (
              <button className={`btn btn-bonus ${order.bonusApplied ? 'on' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_BONUS', id: order.id })}>
                {order.bonusApplied ? '✓ Бонусы списаны — отменить' : '✨ Списать бонусы'}
              </button>
            )}
          </div>

          {/* Счёт / резерв */}
          {order.invoice && (
            <div className="invoice-box">
              <b>Счёт {order.invoice.number}</b> от {order.invoice.date} на сумму <b>{fmt(order.invoice.sum)}</b>
              {order.invoice.reserveUntil && <span className="reserve"> · товар зарезервирован до {order.invoice.reserveUntil}</span>}
              <div className="inv-note">Реальные цены и остатки по данным 1С. Позиции без остатка исключены системой.</div>
            </div>
          )}

          {/* Действия по статусу */}
          <div className="oc-actions">
            {editable && (
              <>
                <button className="btn btn-primary" onClick={() => dispatch({ type: 'FINISH_ORDER', id: order.id })}>✔ Провести заказ</button>
                <button className="btn" onClick={() => dispatch({ type: 'NEW_ORDER', holding: order.holding })}>Новый заказ</button>
              </>
            )}
            {order.status === STATUS.FINISHED && !order.deferred && (
              <>
                <button className="btn" onClick={() => dispatch({ type: 'EDIT_ORDER', id: order.id })}>✎ Редактировать</button>
                <button className="btn btn-ghost" onClick={() => dispatch({ type: 'DEFER_ORDER', id: order.id })}>⏸ Отложить, подумать</button>
              </>
            )}
            {order.status === STATUS.FINISHED && order.deferred && (
              <button className="btn" onClick={() => dispatch({ type: 'UNDEFER_ORDER', id: order.id })}>▶ Вернуть в работу</button>
            )}
            {order.status === STATUS.NEED_APPROVE && (
              <>
                <button className="btn btn-success" onClick={() => dispatch({ type: 'APPROVE_INVOICE', id: order.id })}>💳 Подтвердить счёт и отгрузить</button>
                <button className="btn" onClick={() => dispatch({ type: 'REJECT_TO_EDIT', id: order.id })}>✎ Отредактировать</button>
              </>
            )}
            {deletable && (
              <button className="btn btn-danger-ghost" onClick={() => {
                if (window.confirm(`Удалить заказ ${order.number}?`)) dispatch({ type: 'DELETE_ORDER', id: order.id })
              }}>🗑 Удалить</button>
            )}
          </div>

          {/* Сервисный комментарий (поле карточки заказа) */}
          <div className="sys-comment">
            <div className="sys-comment-head">
              🛈 Служебный комментарий (обмен с 1С/LB):
              <button className="link" onClick={() => setShowComments(v => !v)}>
                {showComments ? 'скрыть историю' : `показать историю (${(order.comments || []).length})`}
              </button>
            </div>
            <div className="sys-comment-text">{order.comment}</div>
            {showComments && (order.comments || []).map((c, i) => (
              <div key={i} className="hist-row"><span className="hist-date">{c.date}</span> {c.text}</div>
            ))}
          </div>
        </>
      )}
    </article>
  )
}
