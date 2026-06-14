# 📊 People Analytics Dashboard · TI

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Dashboard interativo de People Analytics para o Departamento de Tecnologia da Informação**

</div>

---

## 🎯 Sobre o Projeto

O **People Analytics Dashboard · TI** é uma aplicação web desenvolvida em **React + Vite**, projetada para apoiar decisões estratégicas de gestão de pessoas no Departamento de TI. O sistema simula um ambiente corporativo real com dados sintéticos de colaboradores distribuídos entre 5 subsetores, oferecendo visibilidade completa sobre headcount, custos, turnover e performance das equipes.

---

## 🏢 Subsetores Monitorados

| Subsetor | Cor | Foco |
|---|---|---|
| 🔵 Infraestrutura | `#00E5FF` | DevOps, Servidores, Cloud |
| 🟣 Sistemas | `#7C4DFF` | Desenvolvimento de Software |
| 🟢 Redes | `#00E676` | Conectividade e Segurança |
| 🔴 Digital | `#FF5252` | UX, Produto e Marketing Digital |
| 🟡 Projetos | `#FFB300` | PMO, Scrum e Gestão |

---

## ✨ Funcionalidades

### 📊 Visão Executiva
- KPIs estratégicos: colaboradores ativos, turnover, salário médio e custo mensal
- Gráfico de colaboradores por subsetor
- Distribuição por gênero
- Avaliação média por subsetor
- Pirâmide de senioridade (Jr → Coord/Lead)

### 💰 Custos & Salários
- Custo mensal e anual por subsetor
- Treemap de distribuição orçamentária
- Salário médio, mínimo e máximo por área
- Tabela resumo com todos os indicadores financeiros

### 🔄 Turnover
- Taxa de turnover geral e por subsetor
- Comparativo ativos × desligados
- Histórico de desligamentos por mês (timeline)
- Tempo médio de permanência até desligamento

### 👥 Colaboradores
- Scatter plot: Antiguidade × Salário
- Distribuição por modalidade de trabalho (Home Office, Híbrido, Presencial)
- Média de treinamentos por subsetor
- Tabela completa de colaboradores com paginação

### ⚙️ Gestão de Colaboradores
- ➕ **Adicionar** novo colaborador via formulário completo
- ✏️ **Editar** dados de qualquer colaborador
- 🗑️ **Remover** com modal de confirmação
- 🔍 **Busca** por nome, cargo ou ID
- 🎛️ **Filtros** por subsetor e status

---

## 🛠️ Tecnologias Utilizadas

```
React 18          → Interface e componentes
Vite 5            → Build tool e dev server
Recharts 2        → Gráficos e visualizações
DM Sans           → Tipografia principal
Space Mono        → Tipografia monospace (KPIs)
Vercel            → Hospedagem e deploy contínuo
```

---

## 📁 Estrutura do Projeto

```
people-analytics-vercel/
│
├── index.html              → Entrada da aplicação
├── vite.config.js          → Configuração do Vite
├── vercel.json             → Configuração do Vercel
├── package.json            → Dependências e scripts
│
└── src/
    ├── App.jsx             → Componente raiz e roteamento de abas
    ├── Gestao.jsx          → Aba de gestão (CRUD de colaboradores)
    ├── components.jsx      → Componentes reutilizáveis (KpiCard, Table, etc.)
    ├── data.js             → Geração de dados sintéticos
    ├── main.jsx            → Ponto de entrada React
    └── index.css           → Estilos globais e variáveis CSS
```

---

## 🚀 Como Rodar Localmente

**Pré-requisitos:** Node.js 18+ instalado

```bash
# 1. Clone o repositório
git clone https://github.com/RafahSnt/Analise-de-Pessoas-TI.git
cd Analise-de-Pessoas-TI

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
http://localhost:5173
```

---

## ☁️ Deploy no Vercel

O projeto está configurado para deploy automático no Vercel. Qualquer push na branch `principal` dispara um novo deploy automaticamente.

**Deploy manual:**
1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório GitHub
3. O Vercel detecta o Vite automaticamente
4. Clique em **Deploy**

---

## 📊 Dados Sintéticos

Os dados são gerados automaticamente no arquivo `src/data.js` com distribuição realista:

| Subsetor | Colaboradores | Faixa Salarial |
|---|---|---|
| Infraestrutura | ~22 | R$ 4.200 – R$ 14.500 |
| Sistemas | ~35 | R$ 4.800 – R$ 18.000 |
| Redes | ~18 | R$ 4.000 – R$ 13.500 |
| Digital | ~20 | R$ 5.200 – R$ 16.000 |
| Projetos | ~15 | R$ 4.500 – R$ 13.000 |

> Os dados são gerados com seed fixo, garantindo consistência entre sessões.

---

## 👨‍💻 Autor

**Rafael Santos** — [@RafahSnt](https://github.com/RafahSnt)

Projeto desenvolvido como parte do Bootcamp de Business Intelligence e Big Data.

---

<div align="center">
  <sub>People Analytics Dashboard · TI © 2026 · Dados Sintéticos para fins educacionais</sub>
</div>
