import React from 'react';

export function KpiCard({ title, value, sub, color = '#00E5FF' }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      padding: '16px 18px',
      flex: '1',
      minWidth: '150px',
    }}>
      <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase',
                    letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'Space Mono', monospace" }}>
        {title}
      </div>
      <div style={{ fontSize: '24px', fontWeight: '700', color, fontFamily: "'Space Mono', monospace",
                    lineHeight: 1.2 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '5px' }}>{sub}</div>}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      padding: '16px',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function CardTitle({ children }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--muted)',
                  textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px',
                  fontFamily: "'Space Mono', monospace" }}>
      {children}
    </div>
  );
}

export function Badge({ children, color }) {
  return (
    <span style={{
      background: `${color}22`,
      color,
      border: `1px solid ${color}44`,
      borderRadius: '4px',
      padding: '2px 8px',
      fontSize: '11px',
      fontFamily: "'Space Mono', monospace",
    }}>
      {children}
    </span>
  );
}

export function Table({ columns, data, maxRows = 12 }) {
  const [page, setPage] = React.useState(0);
  const total = Math.ceil(data.length / maxRows);
  const slice = data.slice(page * maxRows, (page + 1) * maxRows);

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c.key} style={{
                  textAlign: 'left', padding: '8px 12px',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--accent1)', fontSize: '10px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap',
                  background: 'var(--surface)',
                }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'var(--surface)' }}>
                {columns.map(c => (
                  <td key={c.key} style={{
                    padding: '8px 12px', borderBottom: '1px solid var(--border)',
                    color: c.color ? c.color(row) : 'var(--text)', whiteSpace: 'nowrap',
                  }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          {Array.from({ length: total }, (_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: i === page ? 'var(--accent1)' : 'var(--surface)',
              color: i === page ? 'var(--bg)' : 'var(--muted)',
              border: '1px solid var(--border)', fontSize: '12px', fontWeight: '600',
            }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
