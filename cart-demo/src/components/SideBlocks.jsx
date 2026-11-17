import { useState } from 'react'
import { CATALOG, COMPANY, fmt } from '../data'

// Бонусы + рекламный блок + акции
export default function SideBlocks() {
  const [openPromo, setOpenPromo] = useState(null)

  const novelties = CATALOG.filter(p => p.isNew)
  const topSales = [...CATALOG].sort((a, b) => b.popularity - a.popularity).slice(0, 4)
  const longAgo = [...CATALOG].sort((a, b) => b.lastPurchasedDaysAgo - a.lastPurchasedDaysAgo).slice(0, 3)

  return (
    <div className="side-blocks">
      {/* Бонусы */}
      <section className="panel bonus-panel">
        <h3>✨ Бонусная программа</h3>
        <div className="bonus-balance">{fmt(COMPANY.bonuses.balance)}</div>
        <div className="bonus-sub">бонусных ₽ контрагента · действуют до {new Date(COMPANY.bonuses.expires).toLocaleDateString('ru-RU')}</div>
        <div className="hint small">Списание возможно не более {COMPANY.bonuses.maxSharePercent}% суммы заказа — кнопка «Списать бонусы» в карточке активного/завершённого заказа.</div>
      </section>

      {/* Рекламный блок */}
      <section className="panel ad-panel">
        <h3>📣 Рекомендуем</h3>
        <AdGroup title="🆕 Новинки" items={novelties} />
        <AdGroup title="🔥 Топ продаж" items={topSales} />
        <AdGroup title="🕒 Вы давно это не покупали" items={longAgo} suffix={(p) => `(${Math.round(p.lastPurchasedDaysAgo / 30)} мес.)`} />
      </section>

      {/* Акции */}
      <section className="panel promo-panel">
        <h3>🎁 Действующие акции</h3>
        {COMPANY.promos.map(pr => (
          <div key={pr.id} className="promo-item">
            <button className="promo-head" onClick={() => setOpenPromo(openPromo === pr.id ? null : pr.id)}>
              <span>{pr.title}</span>
              <span className="promo-chev">{openPromo === pr.id ? '▾' : '▸'}</span>
            </button>
            {openPromo === pr.id && (
              <div className="promo-body">
                <div className="promo-period">Период: {pr.period}</div>
                <ul>{pr.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
                {pr.note && <div className="promo-note">{pr.note}</div>}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}

function AdGroup({ title, items, suffix }) {
  return (
    <div className="ad-group">
      <div className="ad-title">{title}</div>
      {items.map(p => (
        <div key={p.sku} className="ad-row">
          <span>{p.emoji} {p.name.length > 38 ? p.name.slice(0, 38) + '…' : p.name}</span>
          <span className="ad-price">{fmt(p.price)}{suffix ? ' ' + suffix(p) : ''}</span>
        </div>
      ))}
    </div>
  )
}
