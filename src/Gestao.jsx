import React, { useState } from 'react';
import { SUBSETORES, CORES, fmtBRL } from './data.js';

const HOMEOFFICE_OPTS = ['Integral', 'Híbrido', 'Presencial'];
const NIVEL_OPTS = ['Jr', 'Pleno', 'Sênior', 'Especialista', 'Coord/Lead'];

const EMPTY_FORM = {
  nome: '', setor: SUBSETORES[0], cargo: '', nivel: 'Jr',
  salario: '', homeOffice: 'Híbrido', cidade: '', avaliacao: '3.0',
  admissao: new Date().toISOString().split('T')[0], ativo: true,
};

const inputStyle = {
  width: '100%', background: '#0E1419', border: '1px solid #1E2D3D',
  color: '#E8EDF2', fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
  borderRadius: '6px', padding: '8px 10px', outline: 'none',
};

const labelStyle = {
  fontSize: '10px', color: '#607D8B', textTransform: 'uppercase',
  letterSpacing: '0.08em', display: 'block', marginBottom: '4px',
  fontFamily: "'Space Mono', monospace",
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }}>
      <div style={{
        background: '#141B24', border: '1px solid #1E2D3D', borderRadius: '12px',
        width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: '1px solid #1E2D3D',
        }}>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>{title}</div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: '#607D8B',
            fontSize: '20px', cursor: 'pointer', lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ColaboradorForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.nome.trim()) return alert('Nome é obrigatório!');
    if (!form.cargo.trim()) return alert('Cargo é obrigatório!');
    if (!form.salario || isNaN(+form.salario)) return alert('Salário inválido!');
    onSave({
      ...form,
      salario: +form.salario,
      avaliacao: +form.avaliacao,
      id: form.id || `TI${Date.now()}`,
      treinamentos: form.treinamentos || 0,
      demissao: form.ativo ? null : form.demissao || new Date().toISOString().split('T')[0],
      antiguidade: Math.round((new Date() - new Date(form.admissao)) / (1000 * 60 * 60 * 24 * 30)),
    });
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <FormField label="Nome Completo">
          <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Ex: João Silva" />
        </FormField>
        <FormField label="Subsetor">
          <select style={inputStyle} value={form.setor} onChange={e => set('setor', e.target.value)}>
            {SUBSETORES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
        <FormField label="Cargo">
          <input style={inputStyle} value={form.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ex: Analista de Sistemas" />
        </FormField>
        <FormField label="Nível">
          <select style={inputStyle} value={form.nivel} onChange={e => set('nivel', e.target.value)}>
            {NIVEL_OPTS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </FormField>
        <FormField label="Salário (R$)">
          <input style={inputStyle} type="number" value={form.salario} onChange={e => set('salario', e.target.value)} placeholder="Ex: 8000" />
        </FormField>
        <FormField label="Avaliação (0-5)">
          <input style={inputStyle} type="number" min="0" max="5" step="0.1" value={form.avaliacao} onChange={e => set('avaliacao', e.target.value)} />
        </FormField>
        <FormField label="Modalidade">
          <select style={inputStyle} value={form.homeOffice} onChange={e => set('homeOffice', e.target.value)}>
            {HOMEOFFICE_OPTS.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </FormField>
        <FormField label="Cidade">
          <input style={inputStyle} value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Ex: São Paulo" />
        </FormField>
        <FormField label="Data de Admissão">
          <input style={inputStyle} type="date" value={form.admissao} onChange={e => set('admissao', e.target.value)} />
        </FormField>
        <FormField label="Status">
          <select style={inputStyle} value={form.ativo ? 'ativo' : 'desligado'} onChange={e => set('ativo', e.target.value === 'ativo')}>
            <option value="ativo">✓ Ativo</option>
            <option value="desligado">✗ Desligado</option>
          </select>
        </FormField>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button onClick={onCancel} style={{
          padding: '9px 20px', borderRadius: '7px', border: '1px solid #1E2D3D',
          background: 'transparent', color: '#607D8B', fontSize: '13px', cursor: 'pointer',
        }}>Cancelar</button>
        <button onClick={handleSave} style={{
          padding: '9px 20px', borderRadius: '7px', border: 'none',
          background: 'var(--accent1)', color: '#080C10', fontSize: '13px',
          fontWeight: '700', cursor: 'pointer',
        }}>Salvar</button>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirmar Ação" onClose={onCancel}>
      <p style={{ color: '#E8EDF2', marginBottom: '20px', fontSize: '14px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{
          padding: '9px 20px', borderRadius: '7px', border: '1px solid #1E2D3D',
          background: 'transparent', color: '#607D8B', fontSize: '13px', cursor: 'pointer',
        }}>Cancelar</button>
        <button onClick={onConfirm} style={{
          padding: '9px 20px', borderRadius: '7px', border: 'none',
          background: '#FF5252', color: '#fff', fontSize: '13px',
          fontWeight: '700', cursor: 'pointer',
        }}>Confirmar</button>
      </div>
    </Modal>
  );
}

export default function TabGestao({ colaboradores, onAdicionar, onEditar, onRemover }) {
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'confirm'
  const [editTarget, setEditTarget] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filterSetor, setFilterSetor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const filtered = colaboradores.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.nome.toLowerCase().includes(q) && !c.cargo.toLowerCase().includes(q) && !c.id.toLowerCase().includes(q)) return false;
    if (filterSetor && c.setor !== filterSetor) return false;
    if (filterStatus === 'ativo' && !c.ativo) return false;
    if (filterStatus === 'desligado' && c.ativo) return false;
    return true;
  });

  const handleAdd = async (data) => {
    setSaving(true); setSaveError(null);
    try { await onAdicionar(data); setModal(null); }
    catch (e) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const handleEdit = async (data) => {
    setSaving(true); setSaveError(null);
    try { await onEditar(data); setModal(null); setEditTarget(null); }
    catch (e) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const handleRemove = async () => {
    setSaving(true); setSaveError(null);
    try { await onRemover(confirmTarget); setModal(null); setConfirmTarget(null); }
    catch (e) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const openEdit = (c) => { setEditTarget(c); setModal('edit'); };
  const openConfirm = (id) => { setConfirmTarget(id); setModal('confirm'); };

  const ativos = colaboradores.filter(c => c.ativo).length;
  const deslig = colaboradores.filter(c => !c.ativo).length;
  const salMedio = ativos > 0
    ? colaboradores.filter(c => c.ativo).reduce((a, c) => a + c.salario, 0) / ativos
    : 0;

  return (
    <div className="fade-in">
      {/* KPIs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total de Registros', value: colaboradores.length, color: 'var(--accent1)' },
          { label: 'Colaboradores Ativos', value: ativos, color: 'var(--accent3)' },
          { label: 'Desligados', value: deslig, color: 'var(--accent4)' },
          { label: 'Salário Médio', value: fmtBRL(salMedio), color: 'var(--accent2)' },
        ].map((k, i) => (
          <div key={i} style={{
            background: 'var(--card)', border: '1px solid var(--border)',
            borderLeft: `3px solid ${k.color}`, borderRadius: '10px',
            padding: '14px 18px', flex: '1', minWidth: '140px',
          }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase',
                          letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'Space Mono', monospace" }}>
              {k.label}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: k.color,
                          fontFamily: "'Space Mono', monospace" }}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px',
        padding: '14px 16px', marginBottom: '14px',
        display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <input
          style={{ ...inputStyle, maxWidth: '220px' }}
          placeholder="🔍 Buscar por nome, cargo ou ID..."
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select style={{ ...inputStyle, maxWidth: '160px' }} value={filterSetor} onChange={e => setFilterSetor(e.target.value)}>
          <option value="">Todos os Setores</option>
          {SUBSETORES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={{ ...inputStyle, maxWidth: '140px' }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os Status</option>
          <option value="ativo">✓ Ativos</option>
          <option value="desligado">✗ Desligados</option>
        </select>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={() => setModal('add')} style={{
            padding: '9px 18px', borderRadius: '7px', border: 'none',
            background: 'var(--accent1)', color: '#080C10', fontSize: '13px',
            fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            ＋ Adicionar Colaborador
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '10px', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {['ID','Nome','Subsetor','Cargo','Nível','Salário','Avaliação','Modalidade','Status','Ações'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 12px',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--accent1)', fontSize: '10px',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} style={{
                  background: i % 2 === 0 ? 'transparent' : 'var(--surface)',
                  transition: 'background 0.15s',
                }}>
                  <td style={{ padding: '9px 12px', color: 'var(--muted)', fontFamily: "'Space Mono', monospace", fontSize: '11px' }}>{c.id}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.nome}</td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      color: CORES[c.setor], background: `${CORES[c.setor]}18`,
                      border: `1px solid ${CORES[c.setor]}33`,
                      borderRadius: '4px', padding: '2px 7px', fontSize: '11px',
                      fontWeight: 500, whiteSpace: 'nowrap',
                    }}>{c.setor}</span>
                  </td>
                  <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>{c.cargo}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--muted)' }}>{c.nivel}</td>
                  <td style={{ padding: '9px 12px', fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap' }}>{fmtBRL(c.salario)}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--accent5)' }}>{c.avaliacao}/5</td>
                  <td style={{ padding: '9px 12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{c.homeOffice}</td>
                  <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                    <span style={{ color: c.ativo ? 'var(--accent3)' : 'var(--accent4)', fontSize: '11px', fontWeight: 500 }}>
                      {c.ativo ? '● Ativo' : '○ Desligado'}
                    </span>
                  </td>
                  <td style={{ padding: '9px 12px', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(c)} style={{
                      padding: '4px 10px', borderRadius: '5px', border: '1px solid var(--border)',
                      background: 'transparent', color: 'var(--accent1)', fontSize: '11px',
                      cursor: 'pointer', marginRight: '6px',
                    }}>✏️ Editar</button>
                    <button onClick={() => openConfirm(c.id)} style={{
                      padding: '4px 10px', borderRadius: '5px', border: '1px solid #FF525233',
                      background: 'transparent', color: 'var(--accent4)', fontSize: '11px',
                      cursor: 'pointer',
                    }}>🗑️ Remover</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)',
                      fontSize: '11px', color: 'var(--muted)', fontFamily: "'Space Mono', monospace" }}>
          {filtered.length} de {colaboradores.length} registros
        </div>
      </div>

      {/* Modais */}
      {saveError && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#FF525218', border: '1px solid #FF525244', color: '#FF5252',
          padding: '10px 20px', borderRadius: '8px', fontSize: '13px', zIndex: 2000,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          ⚠️ Erro ao salvar: {saveError}
        </div>
      )}
      {saving && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--accent1)', padding: '10px 18px', borderRadius: '8px',
          fontSize: '12px', zIndex: 2000, fontFamily: "'Space Mono', monospace",
        }}>
          Salvando...
        </div>
      )}
      {modal === 'add' && (
        <Modal title="➕ Adicionar Colaborador" onClose={() => setModal(null)}>
          <ColaboradorForm onSave={handleAdd} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal === 'edit' && editTarget && (
        <Modal title="✏️ Editar Colaborador" onClose={() => { setModal(null); setEditTarget(null); }}>
          <ColaboradorForm initial={editTarget} onSave={handleEdit} onCancel={() => { setModal(null); setEditTarget(null); }} />
        </Modal>
      )}
      {modal === 'confirm' && (
        <ConfirmModal
          message="Tem certeza que deseja remover este colaborador? Esta ação não pode ser desfeita."
          onConfirm={handleRemove}
          onCancel={() => { setModal(null); setConfirmTarget(null); }}
        />
      )}
    </div>
  );
}
