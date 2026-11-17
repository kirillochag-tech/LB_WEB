import { useState } from 'react'
import { CATALOG, COMPANY, HOLDINGS } from '../data'
import { useStore } from '../store'

// Быстрый поиск + добавление товаров (эмуляция каталога на странице корзины)
export default function CatalogStrip() {
  const { dispatch } = useStore()
  const [q, setQ] = useState('')
  const [holdingFilter, setHoldingFilter] = useState('all')

  const filtered = CATALOG.filter(p =>
    (holdingFilter === 'all' || p.holding === holdingFilter) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
  )

  return (
    <section className="panel catalog-strip">
      <div className="panel-head">
        <h3>➕ Добавить товар из каталога</h3>
        <div className="seg">
          <button className={holdingFilter === 'all' ? 'on' : ''} onClick={() => setHoldingFilter('all')}>Все холдинги</button>
          <button className={holdingFilter === 'stroy' ? 'on seg-stroy' : ''} onClick={() => setHoldingFilter('stroy')}>Стройка</button>
          <button className={holdingFilter === 'home' ? 'on seg-home' : ''} onClick={() => setHoldingFilter('home')}>Home (ОХ)</button>
        </div>
      </div>
      <input className="search" placeholder="Поиск по названию или артикулу…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="catalog-grid">
        {filtered.map(p => (
          <div key={p.sku} className={`cat-card ${HOLDINGS[p.holding].colorClass}-soft`}>
            <div className="cat-emoji">{p.emoji}</div>
            <div className="cat-info">
              <div className="cat-name">{p.name}</div>
              <div className="cat-meta">{p.sku} · остаток {p.stock} {p.unit}</div>
              <div className="cat-price-row">
                <span className="cat-price">{p.price.toLocaleString('ru-RU')} ₽/{p.unit}</span>
                <button className="btn btn-primary btn-sm" title="Товар попадёт в активный заказ холдинга (или создаст новый)"
                  onClick={() => dispatch({ type: 'ADD_ITEM', product: p })}>В корзину</button>
              </div>
              <div className="cat-holding-tag">{HOLDINGS[p.holding].name}</div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="empty">Ничего не найдено</div>}
      </div>
      <p className="hint">💡 Подсказка ТЗ: если у клиента нет активного заказа холдинга — при добавлении товара новый заказ создаётся автоматически. Если есть «Активный» — товар добавляется в него.</p>
    </section>
  )
}
