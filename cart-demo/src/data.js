// ============================================================
// Демо-данные для страницы корзины (LB / Леруа-подобный холдинг)
// Холдинги: "stroy" (Стройка) и "home" (ОХ — Home)
// ============================================================

export const HOLDINGS = {
  stroy: { id: 'stroy', name: 'Стройка', legalEntity: 'ООО «ЛБ-Строй»', colorClass: 'holding-stroy' },
  home:  { id: 'home',  name: 'Home (ОХ)', legalEntity: 'ООО «ЛБ-Хоум»', colorClass: 'holding-home' },
}

export const STATUS = {
  ACTIVE:        'Активный',
  FINISHED:      'Завершен',
  SENT:          'Отправлен',
  NEED_APPROVE:  'Требует согласования',
  APPROVED:      'Согласован',
  IN_ASSEMBLY:   'Согласован и отправлен в сборку',
  ASSEMBLED:     'Собран',
}

export const STATUS_ORDER = [
  STATUS.ACTIVE, STATUS.FINISHED, STATUS.SENT, STATUS.NEED_APPROVE,
  STATUS.APPROVED, STATUS.IN_ASSEMBLY, STATUS.ASSEMBLED,
]

// Каталог товаров (для блока "Каталог" слева/сверху)
export const CATALOG = [
  // ---- Стройка ----
  { sku: 'ST-1001', name: 'Цемент М500, 50 кг', holding: 'stroy', price: 489, oldPrice: null, stock: 320, unit: 'меш', emoji: '🧱', category: 'Смеси', popularity: 92, lastPurchasedDaysAgo: 12, isNew: false },
  { sku: 'ST-1002', name: 'Гипсокартон Knauf 12.5 мм, 1200×2500', holding: 'stroy', price: 615, oldPrice: 690, stock: 140, unit: 'лист', emoji: '📄', category: 'Отделка', popularity: 87, lastPurchasedDaysAgo: 40, isNew: false },
  { sku: 'ST-1003', name: 'Плита OSB-3 9 мм, 1250×2500', holding: 'stroy', price: 980, oldPrice: null, stock: 65, unit: 'лист', emoji: '🪵', category: 'Древесина', popularity: 74, lastPurchasedDaysAgo: 210, isNew: false },
  { sku: 'ST-1004', name: 'Утеплитель ROCKWOOL 100 мм, 6.12 м²', holding: 'stroy', price: 1490, oldPrice: 1720, stock: 88, unit: 'упак', emoji: '🧊', category: 'Изоляция', popularity: 81, lastPurchasedDaysAgo: 65, isNew: false },
  { sku: 'ST-1005', name: 'Кирпич керамический рядовой, 1 шт', holding: 'stroy', price: 21, oldPrice: null, stock: 24000, unit: 'шт', emoji: '🟥', category: 'Кладка', popularity: 95, lastPurchasedDaysAgo: 30, isNew: false },
  { sku: 'ST-1006', name: 'Профнастил С8 оцинк., 2.0 м', holding: 'stroy', price: 1350, oldPrice: null, stock: 42, unit: 'лист', emoji: '🛠️', category: 'Кровля', popularity: 60, lastPurchasedDaysAgo: 400, isNew: true },
  { sku: 'ST-1007', name: 'Пена монтажная профессиональная 750 мл', holding: 'stroy', price: 520, oldPrice: null, stock: 310, unit: 'балл', emoji: '🫧', category: 'Смеси', popularity: 78, lastPurchasedDaysAgo: 8, isNew: false },
  { sku: 'ST-1008', name: 'Арматура А500С ⌀12 мм, 11.7 м', holding: 'stroy', price: 1120, oldPrice: null, stock: 96, unit: 'шт', emoji: '⛓️', category: 'Металл', popularity: 69, lastPurchasedDaysAgo: 150, isNew: false },
  // ---- Home (ОХ) ----
  { sku: 'HM-2001', name: 'Лампа LED E27 10 Вт, 4000K', holding: 'home', price: 149, oldPrice: 199, stock: 850, unit: 'шт', emoji: '💡', category: 'Электрика', popularity: 90, lastPurchasedDaysAgo: 5, isNew: false },
  { sku: 'HM-2002', name: 'Смеситель для кухни, хром', holding: 'home', price: 3450, oldPrice: null, stock: 55, unit: 'шт', emoji: '🚰', category: 'Сантехника', popularity: 76, lastPurchasedDaysAgo: 90, isNew: false },
  { sku: 'HM-2003', name: 'Краска интерьерная моющаяся 9 л', holding: 'home', price: 2890, oldPrice: 3200, stock: 120, unit: 'ведро', emoji: '🎨', category: 'Отделка', popularity: 84, lastPurchasedDaysAgo: 20, isNew: false },
  { sku: 'HM-2004', name: 'Ламинат 33 класс «Дуб натуральный», 2.55 м²', holding: 'home', price: 1690, oldPrice: null, stock: 210, unit: 'упак', emoji: '🟫', category: 'Напольные покрытия', popularity: 88, lastPurchasedDaysAgo: 320, isNew: false },
  { sku: 'HM-2005', name: 'Душевая кабина 90×90, с крышей', holding: 'home', price: 28900, oldPrice: 34500, stock: 7, unit: 'шт', emoji: '🚿', category: 'Сантехника', popularity: 52, lastPurchasedDaysAgo: 500, isNew: true },
  { sku: 'HM-2006', name: 'Карниз потолочный алюминиевый 2 м', holding: 'home', price: 390, oldPrice: null, stock: 400, unit: 'шт', emoji: '➖', category: 'Декор', popularity: 61, lastPurchasedDaysAgo: 100, isNew: false },
  { sku: 'HM-2007', name: 'Розетка двойная с заземлением, белая', holding: 'home', price: 235, oldPrice: null, stock: 640, unit: 'шт', emoji: '🔌', category: 'Электрика', popularity: 82, lastPurchasedDaysAgo: 15, isNew: false },
  { sku: 'HM-2008', name: 'Зеркало в ванную 60 см с подсветкой', holding: 'home', price: 5990, oldPrice: 7400, stock: 18, unit: 'шт', emoji: '🪞', category: 'Декор', popularity: 47, lastPurchasedDaysAgo: 600, isNew: false },
]

// Адреса доставки (подгружаются из 1С) — обязательное поле при отправке
export const DELIVERY_ADDRESSES = [
  { id: 'adr-1', label: 'г. Москва, Каширское шоссе, 21, стр. 5 (объект «Южный парк»)', contact: 'Прораб: Сергей Викторович, +7 (915) 220-11-45', hours: 'Приёмка пн–пт 08:00–17:00', from1c: true },
  { id: 'adr-2', label: 'г. Москва, ул. Дачная, 7 (база хранения)', contact: 'Кладовщик: Игорь Анатольевич, +7 (903) 771-88-02', hours: 'Приёмка ежедневно 09:00–18:00', from1c: true },
  { id: 'adr-3', label: 'МО, г. Подольск, ул. Комсомольская, 1 (офис)', contact: 'Завхоз: Мария Олеговна, +7 (926) 004-13-77', hours: 'Приёмка пн–пт 10:00–16:00', from1c: true },
]

// Контрагент, сотрудники, бонусы, долги, документы, акции
export const COMPANY = {
  name: 'ООО «РемонтСтройГрупп»',
  inn: '7712345678',
  manager: { name: 'Анна Ковалёва', phone: '+7 (495) 123-45-67', email: 'a.kovaleva@lb.ru' },
  bonuses: { balance: 4230, expires: '2026-12-31', maxSharePercent: 20 }, // списание не более 20% суммы заказа
  debts: [
    { doc: 'Счёт №1058 от 03.10.2026', holding: 'stroy', amount: 184250, dueDate: 'просрочено 12 дней' },
    { doc: 'Счёт №1120 от 20.10.2026', holding: 'home', amount: 46800, dueDate: 'до 25.11.2026' },
  ],
  unsignedDocs: [
    { doc: 'Договор поставки №42-П (приложение 3)', date: 'от 05.11.2026', action: 'Подписать ЭДО' },
    { doc: 'УПД №1058 (расхождение по количеству)', date: 'от 08.11.2026', action: 'Согласовать' },
    { doc: 'Акт сверки взаиморасчётов за октябрь', date: 'от 31.10.2026', action: 'Подписать ЭДО' },
  ],
  promos: [
    {
      id: 'promo-1', title: 'Чёрная пятница: скидка до 25% на отделку', period: '17.11 – 30.11.2026',
      items: ['Краски и лаки — 20%', 'Ламинат и плинтус — 15%', 'Крепёж для пола — 25%'],
      note: 'Не суммируется с бонусами.',
    },
    {
      id: 'promo-2', title: 'Купи цемент — мешок клея в подарок', period: '01.11 – 15.12.2026',
      items: ['От 50 мешков цемента М500 — 5 мешков плиточного клея бесплатно', 'От 100 мешков — 12 мешков'],
      note: 'Акция холдинга «Стройка». Действует для юрлиц.',
    },
    {
      id: 'promo-3', title: 'Бесплатная доставка от 50 000 ₽', period: 'Постоянная акция',
      items: ['Стройка: доставка от 50 000 ₽ — бесплатно (в пределах МКАД)', 'Home: доставка от 30 000 ₽ — бесплатно'],
      note: '',
    },
  ],
  employees: [
    { id: 'emp-1', name: 'Вы — Дмитрий Соколов (снабженец)' },
    { id: 'emp-2', name: 'Елена Соколова (главный инженер)' },
    { id: 'emp-3', name: 'Павел Титов (прораб, объект «Южный парк»)' },
  ],
}

let uidCounter = 100
export const uid = (p = 'x') => `${p}-${++uidCounter}`

const item = (sku, qty) => {
  const prod = CATALOG.find(p => p.sku === sku)
  return { id: uid('it'), sku, name: prod.name, holding: prod.holding, price: prod.price, qty, unit: prod.unit, emoji: prod.emoji }
}

// Первичный набор заказов в корзине клиента
export const INITIAL_ORDERS = [
  {
    id: 'ord-1', number: 'ЗК-2026-0451', holding: 'stroy', status: STATUS.ACTIVE, deferred: false,
    createdBy: 'Дмитрий Соколов', createdAt: '14.11.2026', comment: 'Сайт: заказ создан, статус «Активный». Товары добавляются клиентом.',
    bonusApplied: 0, deliveryAddressId: null, invoice: null,
    items: [item('ST-1001', 80), item('ST-1007', 12), item('ST-1005', 1200)],
  },
  {
    id: 'ord-2', number: 'ЗК-2026-0448', holding: 'stroy', status: STATUS.FINISHED, deferred: false,
    createdBy: 'Елена Соколова', createdAt: '12.11.2026', comment: 'Сайт: заказ завершён клиентом (нажата «Новый заказ»). Ожидает отправки менеджеру.',
    bonusApplied: 0, deliveryAddressId: null, invoice: null,
    items: [item('ST-1002', 40), item('ST-1004', 15), item('ST-1008', 30)],
  },
  {
    id: 'ord-3', number: 'ЗК-2026-0439', holding: 'home', status: STATUS.NEED_APPROVE, deferred: false,
    createdBy: 'Дмитрий Соколов', createdAt: '08.11.2026',
    comment: '1С: Заказ с сайта проведён, ожидает подтверждения. Резерв создан (Х=7 дней). Позиция HM-2008 снята — нет на складе, замен нет.',
    bonusApplied: 0, deliveryAddressId: 'adr-1',
    invoice: { number: 'СП-8841', date: '09.11.2026', sum: 12840, reserveUntil: '16.11.2026' },
    items: [item('HM-2003', 2), item('HM-2001', 20), item('HM-2007', 14)],
  },
  {
    id: 'ord-4', number: 'ЗК-2026-0421', holding: 'stroy', status: STATUS.IN_ASSEMBLY, deferred: false,
    createdBy: 'Павел Титов', createdAt: '02.11.2026',
    comment: '1С: Счёт подтверждён клиентом, заказ проведён и передан в сборку. ARM логиста: ориентировочный день доставки — 19.11.2026 (до 12:00, борт 5 т).',
    bonusApplied: 500, deliveryAddressId: 'adr-1',
    invoice: { number: 'СП-8790', date: '03.11.2026', sum: 96520, reserveUntil: null },
    items: [item('ST-1001', 150), item('ST-1003', 30), item('ST-1006', 24)],
  },
  {
    id: 'ord-5', number: 'ЗК-2026-0402', holding: 'home', status: STATUS.ASSEMBLED, deferred: false,
    createdBy: 'Елена Соколова', createdAt: '25.10.2026',
    comment: '1С: Сборка завершена, оформлена реализация. Документы: УПД-2026-1187.',
    bonusApplied: 0, deliveryAddressId: 'adr-3',
    invoice: { number: 'СП-8712', date: '26.10.2026', sum: 41230, reserveUntil: null },
    items: [item('HM-2002', 3), item('HM-2004', 12), item('HM-2006', 10)],
  },
  {
    id: 'ord-6', number: 'ЗК-2026-0444', holding: 'home', status: STATUS.FINISHED, deferred: true,
    createdBy: 'Дмитрий Соколов', createdAt: '10.11.2026',
    comment: 'Сайт: заказ отложен клиентом («Отложить, подумать»). Система игнорирует его при проверке забытых заказов.',
    bonusApplied: 0, deliveryAddressId: null, invoice: null,
    items: [item('HM-2005', 1), item('HM-2008', 2)],
  },
  {
    id: 'ord-7', number: 'ЗК-2026-0417', holding: 'stroy', status: STATUS.SENT, deferred: false,
    createdBy: 'Павел Титов', createdAt: '05.11.2026',
    comment: 'Сайт → LB: заказ отправлен менеджеру. Ожидается обработка в 1С.',
    bonusApplied: 0, deliveryAddressId: 'adr-2', invoice: null,
    items: [item('ST-1005', 2000), item('ST-1001', 60)],
  },
]

// Вспомогательные функции
export const orderSum = (o) => o.items.reduce((s, it) => s + it.price * it.qty, 0) - (o.bonusApplied || 0)
export const fmt = (n) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' ₽'
