# People Analytics Dashboard · TI

Dashboard interativo de People Analytics para o Departamento de TI.
Desenvolvido em React + Vite, pronto para deploy no Vercel.

## Arquivos do Projeto

```
index.html          ← Entrada da aplicação
vercel.json         ← Configuração do Vercel
vite.config.js      ← Configuração do build
package.json        ← Dependências
src/
  App.jsx           ← Dashboard principal (4 abas)
  data.js           ← Geração de dados sintéticos
  components.jsx    ← Componentes reutilizáveis
  main.jsx          ← Ponto de entrada React
  index.css         ← Estilos globais
```

## Deploy no Vercel — Passo a Passo

### 1. Criar repositório no GitHub
- Acesse https://github.com → New repository
- Nome: people-analytics-ti
- Marque como Public
- Marque "Add a README file"
- Clique em Create repository

### 2. Upload dos arquivos
- Dentro do repositório, clique em "uploading an existing file"
- Envie TODOS os arquivos e a pasta src/
- Clique em Commit changes

### 3. Deploy no Vercel
- Acesse https://vercel.com
- Clique em Add New Project
- Importe o repositório people-analytics-ti
- O Vercel detecta Vite automaticamente
- Clique em Deploy

### 4. Pronto!
Sua URL estará disponível em cerca de 1 minuto:
https://people-analytics-ti.vercel.app

## Rodando Localmente

```bash
npm install
npm run dev
# Acesse: http://localhost:5173
```
