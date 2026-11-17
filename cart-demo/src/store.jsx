// ============================================================
// Стор корзины: вся бизнес-логика ТЗ в одном useReducer-сторе
// ============================================================
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { CATALOG, COMPANY, DELIVERY_ADDRESSES, HOLDINGS, INITIAL_ORDERS, STATUS, fmt, uid } from './data'

const orderSum = (o) => o.items.reduce((s, it) => s + it.price * it.qty, 0) - (o.bonusApplied || 0)
export { orderSum }

const today = () => new Date().toLocaleDateString('ru-RU')

let seq = 460
const nextNumber = () => `ЗК-2026-0${++seq}`

// ---------- действия ----------
function reducer(state, action) {
  const { orders } = state
  const setOrders = (o) => ({ ...state, orders: o })
  const mapOrder = (id, fn) => orders.map(o => (o.id === id ? fn(o) : o))
  const addComment = (o, text) => ({
    ...o,
    comments: [...(o.comments || []), { date: today(), author: 'Система', text }],
    comment: text,
  })

  switch (action.type) {
    // ---- создание заказа ("Новый заказ") ----
    case 'NEW_ORDER': {
      const holding = action.holding
      const numActive = orders.filter(o => o.holding === holding && o.status === STATUS.ACTIVE).length
      if (numActive > 0) {
        return { ...state, toast: `В холдинге «${HOLDINGS[holding].name}» уже есть активный заказ №${orders.find(o=>o.holding===holding&&o.status===STATUS.ACTIVE).number}. Сначала завершите его кнопкой «Новый заказ» или «Провести заказ».` }
      }
      const created = {
        id: uid('ord'), number: nextNumber(), holding, status: STATUS.ACTIVE, deferred: false,
        createdBy: 'Дмитрий Соколов', createdAt: today(), bonusApplied: 0, deliveryAddressId: null, invoice: null,
        items: [], comments: [],
        comment: `Сайт: создан новый заказ пользователем «Дмитрий Соколов». Статус «Активный».`,
      }
      return setOrders([created, ...orders])
    }

    // ---- добавление товара в корзину ----
    case 'ADD_ITEM': {
      const { product } = action
      const holding = product.holding
      let orders2 = orders
      let target = orders2.find(o => o.holding === holding && o.status === STATUS.ACTIVE && !o.deferred)
      // нет активного — автоматически создаём новый заказ
      if (!target) {
        target = {
          id: uid('ord'), number: nextNumber(), holding, status: STATUS.ACTIVE, deferred: false,
          createdBy: 'Дмитрий Соколов', createdAt: today(), bonusApplied: 0, deliveryAddressId: null, invoice: null,
          items: [], comments: [],
          comment: 'Сайт: активных заказов не было — новый заказ создан автоматически при добавлении товара.',
        }
        orders2 = [target, ...orders2]
      }
      const exists = target.items.find(i => i.sku === product.sku)
      const items = exists
        ? target.items.map(i => (i.sku === product.sku ? { ...i, qty: i.qty + 1 } : i))
        : [...target.items, { id: uid('it'), sku: product.sku, name: product.name, holding, price: product.price, qty: 1, unit: product.unit, emoji: product.emoji }]
      const updated = { ...target, items }
      return setOrders(orders2.map(o => (o.id === updated.id ? updated : o)))
    }

    case 'SET_QTY': {
      const next = orders.map(o => ({
        ...o,
        items: o.items.map(i => (i.id === action.itemId ? { ...i, qty: Math.max(1, action.qty) } : i)),
      }))
      return setOrders(next)
    }

    case 'REMOVE_ITEM':
      return setOrders(orders.map(o => ({ ...o, items: o.items.filter(i => i.id !== action.itemId) })))

    // ---- "Провести заказ" / "Новый заказ" завершает активный ----
    case 'FINISH_ORDER':
      return setOrders(mapOrder(action.id, o => addComment({ ...o, status: STATUS.FINISHED },
        'Сайт: заказ проведён кнопкой «Провести заказ», статус «Завершен». Доступен для отправки и объединения.')))

    case 'EDIT_ORDER': // из "Завершен" вернуться в редактирование
      return setOrders(mapOrder(action.id, o => addComment({ ...o, status: STATUS.ACTIVE },
        'Сайт: заказ возвращён в редактирование (статус «Активный»). Кнопка подтверждения счёта деактивирована.')))

    case 'DELETE_ORDER':
      return setOrders(orders.filter(o => o.id !== action.id))

    // ---- Отложить, подумать ----
    case 'DEFER_ORDER':
      return setOrders(mapOrder(action.id, o => addComment({ ...o, deferred: true },
        'Сайт: заказ отложен («Отложить, подумать»). Система игнорирует его при проверке забытых заказов и при отправке.')))
    case 'UNDEFER_ORDER':
      return setOrders(mapOrder(action.id, o => addComment({ ...o, deferred: false },
        'Сайт: заказ снят с отложения, снова участвует в процессах.')))

    // ---- Объединить заказы (только "Завершен", только то же юрлицо/холдинг) ----
    case 'MERGE_ORDERS': {
      const list = orders.filter(o => action.ids.includes(o.id))
      if (list.length < 2) return state
      // ТЗ: объединение возможно только в рамках одного юрлица/холдинга
      if (new Set(list.map(o => o.holding)).size > 1) {
        return { ...state, toast: 'Объединение заказов разных юрлиц (Стройка + Home) невозможно.' }
      }
      const base = list[0]
      const mergedItems = list.reduce((acc, o) => acc.concat(o.items), [])
      // склейка одинаковых SKU
      const bySku = {}
      for (const it of mergedItems) {
        if (bySku[it.sku]) bySku[it.sku].qty += it.qty
        else bySku[it.sku] = { ...it, id: uid('it') }
      }
      const merged = addComment({
        ...base,
        items: Object.values(bySku),
        status: STATUS.FINISHED,
        deferred: false,
        bonusApplied: 0,
      }, `Сайт: выполнено объединение ${list.length} заказов (${list.map(o => o.number).join(', ')}) в один документ со статусом «Завершен».`)
      return setOrders([merged, ...orders.filter(o => !action.ids.includes(o.id) && o.id !== base.id)])
    }

    // ---- Отправка заказа в LB ----
    case 'SEND_ORDERS': {
      const next = orders.map(o => {
        if (!action.ids.includes(o.id)) return o
        return addComment({ ...o, status: STATUS.SENT, deliveryAddressId: action.addressId },
          'Сайт → LB: заказ отправлен менеджеру. Адрес доставки: ' +
          (DELIVERY_ADDRESSES.find(a => a.id === action.addressId)?.label || '—'))
      })
      return { ...setOrders(next), sendModal: false, toast: 'Заказы отправлены менеджеру в LB.' }
    }

    // ---- Демо-эмуляция обработки в 1С ----
    case 'SIM_1C_PROCESS': {
      let next = orders.map(o => {
        if (o.status !== STATUS.SENT) return o
        const removed = []
        const kept = []
        for (const it of o.items) {
          const prod = CATALOG.find(p => p.sku === it.sku)
          // эмуляция: позиции с малым остатком (<50 ед.) "не найдены" — выбрасываются
          if (prod && prod.stock < 50) removed.push(it)
          else kept.push(it)
        }
        if (kept.length === 0) {
          return addComment({ ...o, status: STATUS.FINISHED },
            '1С: все позиции недоступны, резерв создать не удалось. Заказ возвращён в статус «Завершен» для редактирования.')
        }
        const sum = kept.reduce((s, i) => s + i.price * i.qty, 0)
        return addComment({
          ...o,
          items: kept,
          status: STATUS.NEED_APPROVE,
          invoice: { number: 'СП-' + Math.floor(8900 + Math.random() * 90), date: today(), sum, reserveUntil: plusDays(7) },
          removalNotices: removed.map(it => ({ itemId: it.id, name: it.name, stage: 'first', text: `Позиция «${it.name}» не зарезервирована: нет на складе. Снятие резерва через 7 дней.` })),
        }, `1С: заказ с сайта проведён «На согласование». Создан резерв на ${sum ? fmt(sum) : ''}. Позиции без остатка исключены: ${removed.map(r => r.name).join('; ') || 'нет'}. Ожидает подтверждения клиентом.`)
      })
      return { ...setOrders(next), toast: 'Эмуляция 1С: заказы обработаны, сформированы счета и резервы.' }
    }

    // ---- Подтвердить счёт и отгрузить ----
    case 'APPROVE_INVOICE': {
      // проверка "запрета проведения" (демо: если у клиента есть просроченная задолженность — блокировка)
      const overdue = COMPANY.debts.some(d => String(d.dueDate).includes('просрочено'))
      if (action.blocked || (overdue && action.checkOverdue)) {
        return setOrders(mapOrder(action.id, o => addComment({ ...o },
          '1С: заказ НЕ может быть проведён. Причина: включён запрет проведения из-за просроченной задолженности. Обратитесь к менеджеру Анне Ковалёвой за дополнительной информацией. Требуется помощь менеджера!')))
      }
      return setOrders(mapOrder(action.id, o => {
        const bonus = o.bonusApplied || 0
        return addComment({ ...o, status: STATUS.IN_ASSEMBLY, bonusApplied: bonus },
          '1С: счёт подтверждён клиентом, ранее зарезервированный заказ проведён и отправлен в сборку. ARM логиста: ориентировочный день доставки — ' + plusDays(3) + '. Бонусы списано: ' + fmt(bonus) + '.')
      }))
    }

    // ---- Отредактировать (при требовании согласования) ----
    case 'REJECT_TO_EDIT':
      return setOrders(mapOrder(action.id, o => addComment({ ...o, status: STATUS.FINISHED, invoice: null },
        'Сайт: клиент выбрал «Отредактировать». Заказ вернулся в статус «Завершен». 1С продолжает держать резерв до ' + (o.invoice?.reserveUntil || '—') + '.')))

    // ---- Эмуляция: склад собрал заказ ----
    case 'SIM_ASSEMBLED':
      return setOrders(orders.map(o => o.status === STATUS.IN_ASSEMBLY
        ? addComment({ ...o, status: STATUS.ASSEMBLED }, '1С: сборка завершена на складе, оформлена реализация. Товар передан в доставку (статус «Товар в пути»).')
        : o))

    // ---- Уведомления о снятии с резерва (за сутки / в день снятия) ----
    case 'SIM_RESERVE_NOTICE': {
      let changed = false
      const next = orders.map(o => {
        if (!o.removalNotices?.length) return o
        changed = true
        return addComment({
          ...o,
          removalNotices: o.removalNotices.map(n => ({ ...n, stage: n.stage === 'first' ? 'second' : 'done' })),
        }, n_noticeText(o))
      })
      return { ...setOrders(changed ? next : orders), toast: changed ? 'Клиенту отправлено повторное уведомление о снятии товара с резерва.' : 'Нет позиций, ожидающих снятия с резерва.' }
    }

    // ---- Бонусы ----
    case 'TOGGLE_BONUS': {
      return setOrders(mapOrder(action.id, o => {
        const maxBonus = Math.min(COMPANY.bonuses.balance, Math.floor(orderSumBase(o) * COMPANY.bonuses.maxSharePercent / 100))
        const applied = o.bonusApplied ? 0 : maxBonus
        return { ...o, bonusApplied: applied }
      }))
    }

    // ---- UI ----
    case 'CLEAR_TOAST':
      return { ...state, toast: null }
    case 'OPEN_SEND_MODAL':
      return { ...state, sendModal: true }
    case 'CLOSE_SEND_MODAL':
      return { ...state, sendModal: false }
    case 'SET_MERGE_MODE':
      return { ...state, mergeMode: action.value, mergeSel: [] }
    case 'TOGGLE_MERGE_SEL': {
      const sel = state.mergeSel.includes(action.id)
        ? state.mergeSel.filter(i => i !== action.id)
        : [...state.mergeSel, action.id]
      return { ...state, mergeSel: sel }
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.ntf, ...state.notifications] }
    case 'SET_COLLAPSED':
      return { ...state, collapsed: { ...state.collapsed, [action.id]: action.val } }
    case 'RESET_DEMO':
      return { ...state, orders: INITIAL_ORDERS, sendModal: false, mergeMode: false, mergeSel: [], toast: 'Демо-данные сброшены к исходным.' }

    default:
      return state
  }
}

const n_noticeText = (o) => {
  const names = o.removalNotices.map(n => n.name).join('; ')
  return n.removalNotices[0].stage === 'first'
    ? `Уведомление клиенту (1/2): товары «${names}» будут сняты с резерва завтра. Продублировано в пятницу, если дата выпадает на выходные.`
    : `Уведомление клиенту (2/2): товары «${names}» сняты с резерва сегодня. Позиции можно заменить в заказе.`
}

const orderSumBase = (o) => o.items.reduce((s, it) => s + it.price * it.qty, 0)

function plusDays(n) {
  const d = new Date(Date.now() + n * 86400000)
  return d.toLocaleDateString('ru-RU')
}

// ---------- контекст ----------
const StoreCtx = createContext(null)
export const useStore = () => useContext(StoreCtx)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    orders: INITIAL_ORDERS,
    sendModal: false,
    mergeMode: false,
    mergeSel: [],
    toast: null,
    notifications: [
      { id: 'ntf-1', date: '16.11.2026', text: 'Напоминание: у вас есть неотправленные заказы — ЗК-2026-0448 («Завершен»). Проверка забытых заказов выполняется каждые 7 дней (X=7), копия уведомления уходит менеджеру ОП.' },
    ],
    collapsed: {}, // id -> bool, свёрнутые карточки
  })

  // авто-скрытие тоста
  useEffect(() => {
    if (state.toast) {
      const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 4500)
      return () => clearTimeout(t)
    }
  }, [state.toast])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}
