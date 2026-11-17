import { HOLDINGS, STATUS } from '../data'
import { orderSum, useStore } from '../store'
import OrderCard from './OrderCard'

// Колонка холдинга: список заказов + кнопки управления
export default function HoldingColumn({ holding }) {
  const { state, dispatch } = useStore()
  const h = HOLDINGS[holding]

  const orders = state.orders
    .filter(o => o.holding === holding)
    .sort((a, b) => (a.status === STATUS.ACTIVE ? -1 : 0) - (b.status === STATUS.ACTIVE ? -1 : 0))

  const total = orders.filter(o => !o.deferred).reduce((s, o) => s + orderSum(o), 0)
  const finishedCount = orders.filter(o => o.status === STATUS.FINISHED && !o.deferred).length

  // объединение доступно только в рамках одного холдинга (юрлица) — по ТЗ
  const mergeableInCol = state.mergeSel.filter(id => state.orders.some(o => o.id === id && o.holding === holding))

  return (
    <section className={`holding-col ${h.colorClass}`}>
      <div className="holding-head">
        <div>
          <h2>{h.name}</h2>
          <div className="holding-legal">{h.legalEntity} · база 1С «{holding === 'stroy' ? 'Стройка' : 'ОХ (Home)'}»</div>
        </div>
        <div className="holding-total">
          <div className="hint small">Всего в заказах:</div>
          <b>{total.toLocaleString('ru-RU')} ₽</b>
        </div>
      </div>

      <div className="holding-toolbar">
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'NEW_ORDER', holding })}>🧾 Новый заказ</button>
        <button className={`btn ${state.mergeMode ? 'btn-warning' : ''}`}
          onClick={() => dispatch({ type: 'SET_MERGE_MODE', value: !state.mergeMode })}>
          {state.mergeMode ? '✕ Выйти из объединения' : '🔗 Объединить заказы'}
        </button>
        <button className="btn btn-accent" disabled={finishedCount === 0}
          title={finishedCount === 0 ? 'Нет заказов со статусом «Завершен»' : 'Открыть окно подтверждения отправки'}
          onClick={() => dispatch({ type: 'OPEN_SEND_MODAL' })}>
          📤 Отправить заказ ({finishedCount})
        </button>
      </div>

      {state.mergeMode && (
        <div className="merge-bar">
          Режим объединения: отметьте чекбоксами заказы со статусом <b>«Завершен»</b> этого холдинга и нажмите «Объединить».
          Объединение заказов разных юрлиц (Стройка + Home) невозможно.
          <button className="btn btn-warning btn-sm" disabled={mergeableInCol.length < 2}
            onClick={() => { dispatch({ type: 'MERGE_ORDERS', ids: mergeableInCol }); dispatch({ type: 'SET_MERGE_MODE', value: false }) }}>
            🔗 Объединить выбранное ({mergeableInCol.length})
          </button>
        </div>
      )}

      <div className="orders-stack">
        {orders.map(o => <OrderCard key={o.id} order={o} />)}
        {orders.length === 0 && <div className="empty panel">В этом холдинге пока нет заказов. Создайте новый или добавьте товар из каталога.</div>}
      </div>
    </section>
  )
}
