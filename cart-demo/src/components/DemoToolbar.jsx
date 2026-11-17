import { useState } from 'react'
import { COMPANY, STATUS } from '../data'
import { useStore } from '../store'

// Панель эмуляции внешних систем (1С / LB / склад) — только для демонстрации
export default function DemoToolbar() {
  const { state, dispatch } = useStore()
  const sentCount = state.orders.filter(o => o.status === STATUS.SENT).length
  const assemblyCount = state.orders.filter(o => o.status === STATUS.IN_ASSEMBLY).length
  const reserveCount = state.orders.filter(o => o.removalNotices?.some(n => n.stage !== 'done')).length
  const [showHelp, setShowHelp] = useState(false)

  const notify = (text) => dispatch({ type: 'ADD_NOTIFICATION', ntf: { id: 'ntf-' + Date.now(), date: new Date().toLocaleDateString('ru-RU'), text } })

  return (
    <div className="demo-bar panel">
      <div className="demo-head">
        <b>🧪 Демо-панель внешних систем</b>
        <span className="hint small">(эмуляция 1С / LB / склада для показа сценариев ТЗ)</span>
        <button className="link" onClick={() => setShowHelp(v => !v)}>{showHelp ? 'скрыть сценарий' : 'показать сценарий демонстрации'}</button>
      </div>

      {showHelp && (
        <ol className="scenario">
          <li>Добавьте товар из каталога → он попадёт в «Активный» заказ холдинга (или создаст новый, если активного нет).</li>
          <li>Нажмите «Провести заказ» → статус «Завершен». Кнопка «Новый заказ» завершает текущий и открывает новый.</li>
          <li>«Объединить заказы» → чекбоксы на заказах «Завершен» одного холдинга → «Объединить».</li>
          <li>«Отправить заказ» → модалка со списком готовых заказов и <b>обязательным адресом доставки из 1С</b> → «Подтвердить и отправить» → статус «Отправлен».</li>
          <li>Кнопка <b>«1С: обработать отправленные»</b> → резерв, счёт, исключение недоступных позиций, статус «Требует согласования».</li>
          <li>В карточке: «Подтвердить счёт и отгрузить» → «Согласован и отправлен в сборку» (дата из ARM логиста), либо «Отредактировать» → возврат в «Завершен», резерв держится до Х дней.</li>
          <li>Кнопки «Склад: завершить сборку» и «1С: уведомить о снятии с резерва» показывают остаток жизненного цикла.</li>
          <li>«Отложить, подумать» помечает заказ как игнорируемый системой; удалении/возврат — в карточке.</li>
        </ol>
      )}

      <div className="demo-actions">
        <button className="btn" disabled={sentCount === 0} onClick={() => dispatch({ type: 'SIM_1C_PROCESS' })}>
          ⚙️ 1С: обработать отправленные ({sentCount})
        </button>
        <button className="btn" disabled={assemblyCount === 0} onClick={() => dispatch({ type: 'SIM_ASSEMBLED' })}>
          📦 Склад: завершить сборку ({assemblyCount})
        </button>
        <button className="btn" disabled={reserveCount === 0} onClick={() => dispatch({ type: 'SIM_RESERVE_NOTICE' })}>
          ⏰ 1С: уведомить о снятии с резерва ({reserveCount})
        </button>
        <button className="btn btn-danger-ghost" onClick={() => {
          dispatch({ type: 'APPROVE_INVOICE', id: state.orders.find(o => o.status === STATUS.NEED_APPROVE)?.id, blocked: true })
          notify('Личный кабинет: заказ не может быть проведён в 1С (запрет проведения). Причина: просроченная задолженность. Обратитесь к менеджеру ' + COMPANY.manager.name + ' — ' + COMPANY.manager.phone + '.')
        }}
          disabled={!state.orders.some(o => o.status === STATUS.NEED_APPROVE)}>
          🚫 Смоделировать запрет проведения
        </button>
        <button className="btn btn-ghost" onClick={() => {
          dispatch({ type: 'ADD_NOTIFICATION', ntf: { id: 'ntf-x-' + Date.now(), date: new Date().toLocaleDateString('ru-RU'), text: 'Плановая проверка (X=7 дней): у клиента есть неотправленные заказы со статусом «Завершен». Уведомление дублировано менеджеру ОП.' } })
        }}>
          🔁 Проверить забытые заказы (X дней)
        </button>
      </div>
    </div>
  )
}
