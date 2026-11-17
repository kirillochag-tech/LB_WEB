import { useState } from 'react'
import { COMPANY, fmt } from '../data'

// Сворачиваемые блоки: долги и неподписанные документы
export default function CollapsiblePanels() {
  const [openDebts, setOpenDebts] = useState(false)
  const [openDocs, setOpenDocs] = useState(false)

  const debtTotal = COMPANY.debts.reduce((s, d) => s + d.amount, 0)
  const overdueCount = COMPANY.debts.filter(d => String(d.dueDate).includes('просрочено')).length

  return (
    <div className="collapsible-row">
      {/* Долги */}
      <section className={`collapse-panel ${overdueCount ? 'warn' : ''}`}>
        <button className="collapse-head" onClick={() => setOpenDebts(v => !v)}>
          <span>💰 Задолженность контрагента: <b>{fmt(debtTotal)}</b>{overdueCount > 0 && <span className="warn-tag"> · просрочено позиций: {overdueCount}</span>}</span>
          <span>{openDebts ? '▾' : '▸'}</span>
        </button>
        {openDebts && (
          <div className="collapse-body">
            <table className="mini-table">
              <thead><tr><th>Документ</th><th>Холдинг</th><th>Сумма</th><th>Срок</th></tr></thead>
              <tbody>
                {COMPANY.debts.map((d, i) => (
                  <tr key={i}>
                    <td>{d.doc}</td>
                    <td>{d.holding === 'stroy' ? 'Стройка' : 'Home'}</td>
                    <td><b>{fmt(d.amount)}</b></td>
                    <td className={String(d.dueDate).includes('просрочено') ? 'overdue' : ''}>{d.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="hint small">⚠ При просроченной задолженности 1С может включить запрет проведения заказа — уведомление придёт в личный кабинет.</p>
          </div>
        )}
      </section>

      {/* Неподписанные документы */}
      <section className="collapse-panel">
        <button className="collapse-head" onClick={() => setOpenDocs(v => !v)}>
          <span>📑 Неподписанных документов: <b>{COMPANY.unsignedDocs.length}</b></span>
          <span>{openDocs ? '▾' : '▸'}</span>
        </button>
        {openDocs && (
          <div className="collapse-body">
            {COMPANY.unsignedDocs.map((d, i) => (
              <div key={i} className="doc-row">
                <div>
                  <div className="doc-name">{d.doc}</div>
                  <div className="doc-date">{d.date}</div>
                </div>
                <button className="btn btn-sm">{d.action}</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
