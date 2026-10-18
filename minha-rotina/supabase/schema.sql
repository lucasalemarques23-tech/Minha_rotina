-- Minha Rotina: banco de dados no Supabase
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".
-- Pode rodar mais de uma vez sem problema.

-- 1) Um registro por dia: o que foi marcado no checklist
create table if not exists public.dias (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  data       date not null,
  feitos     text[] not null default '{}',
  n          integer not null default 0,   -- atividades concluídas
  total      integer not null default 0,   -- atividades do dia
  updated_at timestamptz not null default now(),
  primary key (user_id, data)
);

-- 2) A rotina editada de cada dia da semana (0 = domingo ... 6 = sábado)
--    Se um dia não tiver linha aqui, o app usa a rotina padrão.
create table if not exists public.rotina (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dow        smallint not null check (dow between 0 and 6),
  tarefas    jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, dow)
);

-- 3) Segurança: cada pessoa só vê e altera os próprios dados
alter table public.dias   enable row level security;
alter table public.rotina enable row level security;

drop policy if exists "dias do proprio usuario" on public.dias;
create policy "dias do proprio usuario" on public.dias
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "rotina do proprio usuario" on public.rotina;
create policy "rotina do proprio usuario" on public.rotina
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.dias, public.rotina to authenticated;

-- 4) Atualização ao vivo entre celular e computador (Realtime)
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'dias') then
    alter publication supabase_realtime add table public.dias;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'rotina') then
    alter publication supabase_realtime add table public.rotina;
  end if;
end $$;
