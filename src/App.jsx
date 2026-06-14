import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter, FunnelChart, Funnel,
  LabelList, RadarChart, Radar, PolarGrid, PolarAngleAxis, Treemap,
} from 'recharts';
import { DADOS, SUBSETORES, CORES, fmtBRL, fmtPct } from './data.js';
import { KpiCard, Card, CardTitle, Table, Badge } from './components.jsx';
import TabGestao from './Gestao.jsx';

const TABS = [
  { id: 'overview',      label: '📊 Visão Executiva' },
  { id: 'colaboradores', label: '👥 Colaboradores' },
  { id: 'gestao',        label: '⚙️ Gestão' },
];

const TOOLTIP_STYLE = {
  background: '#141B24', border: '1px solid #1E2D3D',
  borderRadius: '8px', color: '#E8EDF2', fontSize: '12px',
  fontFamily: "'DM Sans', sans-serif",
};

function CustomTooltip({ active, payload, label, prefix = '', suffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #1E2D3D',
                    fontWeight: 600, fontSize: '11px', color: '#607D8B' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ padding: '6px 12px', color: p.color || '#E8EDF2' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString('pt-BR') : p.value}{suffix}
        </div>
      ))}
    </div>
  );
}

// ── Filters ────────────────────────────────────────────────────────────────────
function useFiltered(setores, status, salMin, salMax) {
  return useMemo(() => {
    return DADOS.filter(d => {
      if (setores.length > 0 && !setores.includes(d.setor)) return false;
      if (status === 'ativos' && !d.ativo) return false;
      if (status === 'desligados' && d.ativo) return false;
      if (d.salario < salMin || d.salario > salMax) return false;
      return true;
    });
  }, [setores, status, salMin, salMax]);
}

// ── Tab: Overview ──────────────────────────────────────────────────────────────
function TabOverview({ df }) {
  const ativos = df.filter(d => d.ativo);
  const deslig = df.filter(d => !d.ativo);
  const turnover = df.length > 0 ? (deslig.length / df.length) * 100 : 0;
  const salMedio = ativos.length > 0 ? ativos.reduce((a, d) => a + d.salario, 0) / ativos.length : 0;
  const custoMensal = ativos.reduce((a, d) => a + d.salario, 0);
  const avalMedia = ativos.length > 0 ? ativos.reduce((a, d) => a + d.avaliacao, 0) / ativos.length : 0;

  // by setor
  const bySetor = SUBSETORES.map(s => ({
    setor: s, count: ativos.filter(d => d.setor === s).length,
  })).filter(d => d.count > 0);

  // avaliacao por setor
  const avalSetor = SUBSETORES.map(s => {
    const sub = ativos.filter(d => d.setor === s);
    return { setor: s, avg: sub.length > 0 ? sub.reduce((a, d) => a + d.avaliacao, 0) / sub.length : 0 };
  });

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <KpiCard title="Colaboradores Ativos" value={ativos.length} sub={`${df.length} no período total`} color="var(--accent1)" />
        <KpiCard title="Turnover Geral" value={fmtPct(turnover)} sub={`${deslig.length} desligamentos`} color="var(--accent4)" />
        <KpiCard title="Salário Médio" value={fmtBRL(salMedio)} sub="equipe ativa" color="var(--accent2)" />
        <KpiCard title="Custo Mensal" value={fmtBRL(custoMensal)} sub={`Anual: ${fmtBRL(custoMensal * 12)}`} color="var(--accent3)" />
        <KpiCard title="Avaliação Média" value={`${avalMedia.toFixed(1)}/5.0`} sub="performance geral" color="var(--accent5)" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '280px' }}>
          <CardTitle>Colaboradores por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={bySetor} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Colaboradores" radius={[4, 4, 0, 0]}>
                {bySetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="count" position="top" style={{ fill: '#E8EDF2', fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '260px' }}>
          <CardTitle>Avaliação Média por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={avalSetor} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" horizontal={false} />
              <XAxis type="number" domain={[0, 5]} tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip suffix="/5.0" />} />
              <Bar dataKey="avg" name="Avaliação" radius={[0, 4, 4, 0]}>
                {avalSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="avg" position="right" formatter={v => v.toFixed(1)} style={{ fill: '#E8EDF2', fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

      </div>
    </div>
  );
}

// ── Tab: Custos ────────────────────────────────────────────────────────────────
function TabCustos({ df }) {
  const ativos = df.filter(d => d.ativo);

  const custoSetor = SUBSETORES.map(s => {
    const sub = ativos.filter(d => d.setor === s);
    const mensal = sub.reduce((a, d) => a + d.salario, 0);
    const salarios = sub.map(d => d.salario);
    return {
      setor: s,
      colaboradores: sub.length,
      mensal,
      anual: mensal * 12,
      medio: sub.length > 0 ? mensal / sub.length : 0,
      max: salarios.length > 0 ? Math.max(...salarios) : 0,
      min: salarios.length > 0 ? Math.min(...salarios) : 0,
    };
  }).filter(d => d.colaboradores > 0);

  const totalMensal = ativos.reduce((a, d) => a + d.salario, 0);
  const maiorSetor  = custoSetor.sort((a, b) => b.mensal - a.mensal)[0]?.setor || '—';
  const custoSorted = [...custoSetor].sort((a, b) => b.mensal - a.mensal);

  // box plot simulated (Q1, median, Q3 per setor)
  const boxData = SUBSETORES.map(s => {
    const sals = ativos.filter(d => d.setor === s).map(d => d.salario).sort((a, b) => a - b);
    if (!sals.length) return null;
    const q1 = sals[Math.floor(sals.length * 0.25)];
    const med = sals[Math.floor(sals.length * 0.5)];
    const q3 = sals[Math.floor(sals.length * 0.75)];
    return { setor: s, min: sals[0], q1, med, q3, max: sals[sals.length - 1] };
  }).filter(Boolean);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <KpiCard title="Custo Mensal Total" value={fmtBRL(totalMensal)} sub="folha ativa" color="var(--accent3)" />
        <KpiCard title="Custo Anual Projetado" value={fmtBRL(totalMensal * 12)} sub="sem encargos" color="var(--accent1)" />
        <KpiCard title="Maior Custo / Setor" value={maiorSetor} sub="subsetor mais caro" color="var(--accent5)" />
        <KpiCard title="Ticket Médio" value={fmtBRL(ativos.length > 0 ? totalMensal / ativos.length : 0)} sub="por colaborador" color="var(--accent2)" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 2, minWidth: '280px' }}>
          <CardTitle>Custo Mensal por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={custoSorted} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Bar dataKey="mensal" name="Custo Mensal" radius={[4, 4, 0, 0]}>
                {custoSorted.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 1, minWidth: '220px' }}>
          <CardTitle>Distribuição Custo Anual</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={custoSetor} cx="50%" cy="50%" outerRadius={80}
                   dataKey="anual" nameKey="setor" paddingAngle={2}>
                {custoSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={v => fmtBRL(v)} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#607D8B' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '260px' }}>
          <CardTitle>Salário Médio por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={custoSetor} layout="vertical" margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip prefix="R$ " />} />
              <Bar dataKey="medio" name="Salário Médio" radius={[0, 4, 4, 0]}>
                {custoSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="medio" position="right" formatter={v => fmtBRL(v)} style={{ fill: '#E8EDF2', fontSize: 10 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 1, minWidth: '260px' }}>
          <CardTitle>Resumo Salarial por Subsetor</CardTitle>
          <Table
            data={custoSetor}
            maxRows={6}
            columns={[
              { key: 'setor', label: 'Subsetor' },
              { key: 'colaboradores', label: 'Colab.' },
              { key: 'medio', label: 'Médio', render: r => fmtBRL(r.medio) },
              { key: 'min', label: 'Mín.', render: r => fmtBRL(r.min) },
              { key: 'max', label: 'Máx.', render: r => fmtBRL(r.max) },
              { key: 'mensal', label: 'Mensal', render: r => fmtBRL(r.mensal) },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

// ── Tab: Turnover ──────────────────────────────────────────────────────────────
function TabTurnover({ df }) {
  const ativos  = df.filter(d => d.ativo);
  const deslig  = df.filter(d => !d.ativo);
  const turnoverGeral = df.length > 0 ? (deslig.length / df.length) * 100 : 0;

  const turnSetor = SUBSETORES.map(s => {
    const a = ativos.filter(d => d.setor === s).length;
    const d = deslig.filter(d => d.setor === s).length;
    const t = a + d;
    return { setor: s, ativos: a, desligados: d, pct: t > 0 ? (d / t) * 100 : 0 };
  });

  // timeline por mês
  const timeline = {};
  deslig.forEach(d => {
    if (!d.demissao) return;
    const mes = d.demissao.slice(0, 7);
    if (!timeline[mes]) timeline[mes] = {};
    timeline[mes][d.setor] = (timeline[mes][d.setor] || 0) + 1;
  });
  const timelineData = Object.entries(timeline)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-18)
    .map(([mes, setores]) => ({ mes, ...setores }));

  // tempo médio até desligamento
  const tempoSetor = SUBSETORES.map(s => {
    const sub = deslig.filter(d => d.setor === s && d.demissao);
    if (!sub.length) return { setor: s, tempo: 0 };
    const avg = sub.reduce((acc, d) => {
      const dias = (new Date(d.demissao) - new Date(d.admissao)) / (1000 * 60 * 60 * 24 * 30);
      return acc + dias;
    }, 0) / sub.length;
    return { setor: s, tempo: Math.round(avg) };
  });

  const maiorTurn = turnSetor.reduce((a, b) => b.pct > a.pct ? b : a, turnSetor[0]);
  const menorTurn = turnSetor.filter(d => d.pct > 0).reduce((a, b) => b.pct < a.pct ? b : a, turnSetor[0]);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <KpiCard title="Turnover Geral" value={fmtPct(turnoverGeral)} sub="sobre o período total" color="var(--accent4)" />
        <KpiCard title="Total Desligamentos" value={deslig.length} sub="no período" color="var(--accent4)" />
        <KpiCard title="Maior Turnover" value={maiorTurn?.setor || '—'} sub={`${fmtPct(maiorTurn?.pct || 0)} de desligamento`} color="var(--accent5)" />
        <KpiCard title="Menor Turnover" value={menorTurn?.setor || '—'} sub={`${fmtPct(menorTurn?.pct || 0)} de desligamento`} color="var(--accent3)" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '260px' }}>
          <CardTitle>Ativos × Desligados por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={turnSetor} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#607D8B' }} />
              <Bar dataKey="ativos" name="Ativos" stackId="a" fill="var(--accent3)" opacity={0.85} radius={[0,0,0,0]} />
              <Bar dataKey="desligados" name="Desligados" stackId="a" fill="var(--accent4)" opacity={0.85} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 1, minWidth: '260px' }}>
          <CardTitle>Taxa de Turnover por Subsetor (%)</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={turnSetor} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip suffix="%" />} />
              <Bar dataKey="pct" name="Turnover %" radius={[4, 4, 0, 0]}>
                {turnSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="pct" position="top" formatter={v => `${v.toFixed(1)}%`} style={{ fill: '#E8EDF2', fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 3, minWidth: '300px' }}>
          <CardTitle>Histórico de Desligamentos por Mês</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timelineData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="mes" tick={{ fill: '#607D8B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#607D8B' }} />
              {SUBSETORES.map(s => (
                <Line key={s} type="monotone" dataKey={s} stroke={CORES[s]} strokeWidth={2}
                      dot={{ r: 3, fill: CORES[s] }} activeDot={{ r: 5 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 2, minWidth: '220px' }}>
          <CardTitle>Tempo Médio até Desligamento (meses)</CardTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tempoSetor} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="setor" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip suffix=" meses" />} />
              <Bar dataKey="tempo" name="Meses" radius={[0, 4, 4, 0]}>
                {tempoSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="tempo" position="right" style={{ fill: '#E8EDF2', fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── Tab: Colaboradores ─────────────────────────────────────────────────────────
function TabColaboradores({ df }) {
  const ativos = df.filter(d => d.ativo);

  const hoData = ['Integral','Híbrido','Presencial'].map(h => ({
    name: h, value: ativos.filter(d => d.homeOffice === h).length,
  }));
  const HO_CORES = ['var(--accent1)', 'var(--accent2)', 'var(--accent5)'];

  const trainSetor = SUBSETORES.map(s => {
    const sub = ativos.filter(d => d.setor === s);
    return { setor: s, media: sub.length > 0 ? sub.reduce((a, d) => a + d.treinamentos, 0) / sub.length : 0 };
  });

  const scatterData = ativos.map(d => ({
    x: d.antiguidade, y: d.salario, setor: d.setor, nome: d.nome, cargo: d.cargo,
  }));

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <KpiCard title="Colaboradores Ativos" value={ativos.length} sub="na seleção atual" color="var(--accent1)" />
        <KpiCard title="Antiguidade Média" value={`${ativos.length > 0 ? Math.round(ativos.reduce((a, d) => a + d.antiguidade, 0) / ativos.length) : 0} meses`} sub="tempo médio de empresa" color="var(--accent2)" />
        <KpiCard title="Home Office Integral" value={ativos.filter(d => d.homeOffice === 'Integral').length}
          sub={`${ativos.length > 0 ? ((ativos.filter(d => d.homeOffice === 'Integral').length / ativos.length) * 100).toFixed(0) : 0}% do total`} color="var(--accent3)" />
        <KpiCard title="Avaliação Média" value={`${ativos.length > 0 ? (ativos.reduce((a, d) => a + d.avaliacao, 0) / ativos.length).toFixed(1) : 0}/5.0`} sub="performance geral" color="var(--accent5)" />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 3, minWidth: '280px' }}>
          <CardTitle>Antiguidade × Salário</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="x" name="Antiguidade (meses)" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="y" name="Salário" tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ strokeDasharray: '3 3', stroke: '#1E2D3D' }}
                       formatter={(v, n) => [n === 'Salário' ? fmtBRL(v) : `${v} meses`, n]} />
              {SUBSETORES.map(s => (
                <Scatter key={s} name={s} data={scatterData.filter(d => d.setor === s)}
                         fill={CORES[s]} opacity={0.75} />
              ))}
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#607D8B' }} />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 1, minWidth: '180px' }}>
          <CardTitle>Modalidade de Trabalho</CardTitle>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={hoData} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                   dataKey="value" nameKey="name" paddingAngle={3}>
                {hoData.map((e, i) => <Cell key={i} fill={HO_CORES[i]} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, color: '#607D8B' }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Card style={{ flex: 1, minWidth: '220px' }}>
          <CardTitle>Média de Treinamentos por Subsetor</CardTitle>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={trainSetor} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D3D" />
              <XAxis dataKey="setor" tick={{ fill: '#607D8B', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#607D8B', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip suffix=" trein." />} />
              <Bar dataKey="media" name="Média" radius={[4, 4, 0, 0]}>
                {trainSetor.map((e, i) => <Cell key={i} fill={CORES[e.setor]} />)}
                <LabelList dataKey="media" position="top" formatter={v => v.toFixed(1)} style={{ fill: '#E8EDF2', fontSize: 11 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card style={{ flex: 2, minWidth: '300px' }}>
          <CardTitle>Lista de Colaboradores</CardTitle>
          <Table
            data={df}
            maxRows={8}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'nome', label: 'Nome' },
              { key: 'setor', label: 'Subsetor', render: r => (
                <span style={{ color: CORES[r.setor], fontWeight: 500 }}>{r.setor}</span>
              )},
              { key: 'cargo', label: 'Cargo' },
              { key: 'salario', label: 'Salário', render: r => fmtBRL(r.salario) },
              { key: 'avaliacao', label: 'Aval.', render: r => `${r.avaliacao}/5` },
              { key: 'ativo', label: 'Status', render: r => (
                <span style={{ color: r.ativo ? 'var(--accent3)' : 'var(--accent4)', fontSize: 11 }}>
                  {r.ativo ? '● Ativo' : '○ Desligado'}
                </span>
              )},
            ]}
          />
        </Card>
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]       = useState('overview');
  const [setores, setSetores] = useState([]);
  const [colaboradores, setColaboradores] = useState(DADOS);

  const df = useFiltered(setores, 'todos', 0, 99999);

  const toggleSetor = s => setSetores(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent1)', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', fontWeight: 700, color: 'var(--bg)', fontFamily: "'Space Mono', monospace" }}>
            PA
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em' }}>People Analytics</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Departamento de Tecnologia da Informação</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--accent3)', fontFamily: "'Space Mono', monospace" }}>
            ● LIVE
          </div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>
            {new Date().toLocaleDateString('pt-BR', { day:'2-digit', month:'short', year:'numeric' })}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
      }}>
        {/* Setor chips */}
        <div>
          <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'Space Mono', monospace" }}>
            Subsetor
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SUBSETORES.map(s => {
              const active = setores.includes(s);
              return (
                <button key={s} onClick={() => toggleSetor(s)} style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                  border: `1px solid ${active ? CORES[s] : 'var(--border)'}`,
                  background: active ? `${CORES[s]}22` : 'transparent',
                  color: active ? CORES[s] : 'var(--muted)',
                  transition: 'all 0.15s',
                }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', display: 'flex', gap: '2px',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '11px 16px', background: 'transparent', fontSize: '12px', fontWeight: 500,
            color: tab === t.id ? 'var(--accent1)' : 'var(--muted)',
            borderBottom: `2px solid ${tab === t.id ? 'var(--accent1)' : 'transparent'}`,
            border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--accent1)' : 'transparent'}`,
            transition: 'all 0.15s', cursor: 'pointer',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
        {tab === 'overview'      && <TabOverview      df={df} />}
        {tab === 'colaboradores' && <TabColaboradores df={df} />}
        {tab === 'gestao'        && <TabGestao colaboradores={colaboradores} setColaboradores={setColaboradores} />}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        padding: '10px 24px', textAlign: 'center',
        fontSize: '11px', color: 'var(--muted)', fontFamily: "'Space Mono', monospace",
      }}>
        People Analytics Dashboard · TI © {new Date().getFullYear()} · Dados Sintéticos
      </footer>
    </div>
  );
}
