-- ============================================================
-- People Analytics · Supabase Setup
-- Execute no SQL Editor do Supabase (https://app.supabase.com)
-- ============================================================

-- 1. Criar tabela de colaboradores
create table if not exists public.colaboradores (
  id            text primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  nome          text not null,
  setor         text not null,
  cargo         text not null,
  nivel         text not null,
  salario       numeric not null,
  avaliacao     numeric not null default 3.0,
  home_office   text not null default 'Híbrido',
  cidade        text not null default '',
  admissao      date not null,
  demissao      date,
  ativo         boolean not null default true,
  treinamentos  integer not null default 0,
  antiguidade   integer not null default 0,
  genero        text not null default 'N/I',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 2. Índice por usuário (performance)
create index if not exists idx_colaboradores_user_id
  on public.colaboradores (user_id);

-- 3. Habilitar Row Level Security (RLS)
alter table public.colaboradores enable row level security;

-- 4. Política: usuário só acessa os próprios registros
create policy "Usuário acessa somente seus colaboradores"
  on public.colaboradores
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 5. Atualiza updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_colaboradores_updated_at
  before update on public.colaboradores
  for each row execute function public.set_updated_at();
