-- =====================================================================
-- Esquema de la web del restaurante. Se puede ejecutar entero varias veces
-- (Supabase → SQL Editor → pegar → Run). Después ejecutar semilla.sql.
-- =====================================================================

-- ---------- Administradores ----------
create table if not exists admins (
  user_id uuid primary key references auth.users on delete cascade,
  email text
);
alter table admins enable row level security;

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

drop policy if exists "admins se ven a sí mismos" on admins;
create policy "admins se ven a sí mismos" on admins for select using (user_id = auth.uid());

-- ---------- Ajustes generales (una sola fila, id = 1) ----------
create table if not exists ajustes (
  id int primary key default 1 check (id = 1),
  nombre text not null default 'Restaurante',
  eslogan_es text, eslogan_de text,
  direccion text, cp_ciudad text, telefono text, email text, instagram text,
  reserva_url text, maps_url text,
  valoracion text, valoracion_opiniones int, valoracion_fuente text,
  horario jsonb not null default '[]',          -- [{dias_es, dias_de, horas_es, horas_de}]
  cara_jefe text,                               -- URL pública de la foto del dueño
  promo_ruleta_es text, promo_ruleta_de text,   -- casilla de premio opcional en la ruleta
  ranking_con_codigo boolean not null default false, -- ¿hace falta el código del día para puntuar?
  actualizado timestamptz not null default now()
);
-- Columnas añadidas después de crear la tabla (añadir aquí con "add column if not exists")

alter table ajustes enable row level security;
drop policy if exists "ajustes: lectura pública" on ajustes;
create policy "ajustes: lectura pública" on ajustes for select using (true);
drop policy if exists "ajustes: admin escribe" on ajustes;
create policy "ajustes: admin escribe" on ajustes for all using (es_admin()) with check (es_admin());

-- El código del día NO va en ajustes (que es público): va aquí y solo lo lee el admin
create table if not exists secretos (
  id int primary key default 1 check (id = 1),
  codigo_juego text
);
alter table secretos enable row level security;
drop policy if exists "secretos: solo admin" on secretos;
create policy "secretos: solo admin" on secretos for all using (es_admin()) with check (es_admin());
insert into secretos (id) values (1) on conflict do nothing;

-- ---------- Carta ----------
create table if not exists categorias (
  id text primary key,                          -- p. ej. 'tacos' (se usa en enlaces: #carta-tacos)
  grupo text not null default 'comida' check (grupo in ('comida', 'bebida')),
  icono text,
  nombre_es text not null, nombre_de text,
  nota_es text, nota_de text,
  lista boolean not null default false,         -- true = lista compacta (chupitos, cervezas…)
  orden int not null default 0
);
alter table categorias enable row level security;
drop policy if exists "categorias: lectura pública" on categorias;
create policy "categorias: lectura pública" on categorias for select using (true);
drop policy if exists "categorias: admin escribe" on categorias;
create policy "categorias: admin escribe" on categorias for all using (es_admin()) with check (es_admin());

create table if not exists platos (
  id bigint generated always as identity primary key,
  cat text not null references categorias (id) on update cascade on delete restrict,
  sub_es text, sub_de text,                     -- subsección dentro de la categoría
  nombre_es text not null, nombre_de text,
  desc_es text, desc_de text,
  precio numeric(7, 2) not null default 0,
  variantes jsonb not null default '[]',        -- [{es, de, precio}]
  opciones_es text, opciones_de text,
  picante smallint not null default 0 check (picante between 0 and 3),
  veg boolean not null default false,
  vegano boolean not null default false,
  destacado boolean not null default false,
  foto text,
  visible boolean not null default true,
  orden int not null default 0
);
create index if not exists platos_cat_orden on platos (cat, orden);
alter table platos enable row level security;
drop policy if exists "platos: lectura pública de los visibles" on platos;
create policy "platos: lectura pública de los visibles" on platos for select using (visible or es_admin());
drop policy if exists "platos: admin escribe" on platos;
create policy "platos: admin escribe" on platos for all using (es_admin()) with check (es_admin());

-- ---------- Galería ----------
create table if not exists fotos (
  id bigint generated always as identity primary key,
  url text not null,
  ruta text,                                    -- ruta en el bucket (para poder borrarla)
  texto_es text, texto_de text,
  ancho smallint not null default 1 check (ancho in (1, 2)),
  orden int not null default 0
);
alter table fotos enable row level security;
drop policy if exists "fotos: lectura pública" on fotos;
create policy "fotos: lectura pública" on fotos for select using (true);
drop policy if exists "fotos: admin escribe" on fotos;
create policy "fotos: admin escribe" on fotos for all using (es_admin()) with check (es_admin());

-- ---------- Premios de los rankings ----------
create table if not exists premios (
  id bigint generated always as identity primary key,
  periodo text not null check (periodo in ('dia', 'semana', 'mes')),
  juego text,                                   -- null = cualquier juego con ranking
  texto_es text not null, texto_de text,
  activo boolean not null default true,
  orden int not null default 0
);
alter table premios enable row level security;
drop policy if exists "premios: lectura pública" on premios;
create policy "premios: lectura pública" on premios for select using (activo or es_admin());
drop policy if exists "premios: admin escribe" on premios;
create policy "premios: admin escribe" on premios for all using (es_admin()) with check (es_admin());

-- ---------- Puntuaciones de los juegos ----------
create table if not exists puntuaciones (
  id bigint generated always as identity primary key,
  juego text not null,
  alias text not null check (char_length(alias) between 2 and 20),
  instagram text check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  puntos int not null check (puntos between 0 and 100000),
  oculto boolean not null default false,        -- el admin puede ocultar trampas o insultos
  creado timestamptz not null default now()
);
create index if not exists puntuaciones_juego_fecha on puntuaciones (juego, creado desc);
alter table puntuaciones enable row level security;
drop policy if exists "puntuaciones: lectura pública de las visibles" on puntuaciones;
create policy "puntuaciones: lectura pública de las visibles" on puntuaciones for select using (not oculto or es_admin());
drop policy if exists "puntuaciones: admin modera" on puntuaciones;
create policy "puntuaciones: admin modera" on puntuaciones for update using (es_admin()) with check (es_admin());
drop policy if exists "puntuaciones: admin borra" on puntuaciones;
create policy "puntuaciones: admin borra" on puntuaciones for delete using (es_admin());
-- No hay política de INSERT: solo se puede puntuar mediante guardar_puntuacion()

-- Guarda una puntuación comprobando el código del día, el consentimiento y un límite de envíos.
-- Devuelve 'ok' o un código de error: 'codigo', 'consentimiento', 'juego', 'datos', 'espera'.
create or replace function guardar_puntuacion(
  p_juego text, p_alias text, p_instagram text, p_puntos int, p_codigo text, p_consiente boolean
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_ig text := nullif(lower(regexp_replace(coalesce(p_instagram, ''), '^@', '')), '');
  v_alias text := btrim(coalesce(p_alias, ''));
  v_pide_codigo boolean;
  v_codigo text;
begin
  if p_juego not in ('ahorcado', 'memoria', 'quiz', 'pinata', 'lluvia') then return 'juego'; end if;
  if not coalesce(p_consiente, false) then return 'consentimiento'; end if;
  if char_length(v_alias) not between 2 and 20 or p_puntos is null or p_puntos not between 0 and 100000 then return 'datos'; end if;
  if v_ig is not null and v_ig !~ '^[a-z0-9._]{1,30}$' then return 'datos'; end if;

  select ranking_con_codigo into v_pide_codigo from ajustes where id = 1;
  select codigo_juego into v_codigo from secretos where id = 1;
  if coalesce(v_pide_codigo, false) and coalesce(v_codigo, '') <> ''
     and upper(btrim(coalesce(p_codigo, ''))) <> upper(btrim(v_codigo)) then
    return 'codigo';
  end if;

  -- Límite: como mucho 1 puntuación cada 20 segundos por alias/Instagram y juego
  if exists (
    select 1 from puntuaciones
    where juego = p_juego and creado > now() - interval '20 seconds'
      and lower(coalesce(instagram, alias)) = lower(coalesce(v_ig, v_alias))
  ) then return 'espera'; end if;

  insert into puntuaciones (juego, alias, instagram, puntos) values (p_juego, v_alias, v_ig, p_puntos);
  return 'ok';
end;
$$;
grant execute on function guardar_puntuacion(text, text, text, int, text, boolean) to anon, authenticated;

-- Ranking: la mejor puntuación de cada jugador en el periodo (hora de Alemania)
create or replace function ranking(p_juego text, p_periodo text, p_limite int default 10)
returns table (alias text, instagram text, puntos int, creado timestamptz)
language sql stable set search_path = public as $$
  with desde as (
    select (date_trunc(case p_periodo when 'dia' then 'day' when 'mes' then 'month' else 'week' end,
            now() at time zone 'Europe/Berlin') at time zone 'Europe/Berlin') as t
  ), mejores as (
    select distinct on (lower(coalesce(p.instagram, p.alias)))
      p.alias, p.instagram, p.puntos, p.creado
    from puntuaciones p, desde
    where p.juego = p_juego and not p.oculto and p.creado >= desde.t
    order by lower(coalesce(p.instagram, p.alias)), p.puntos desc, p.creado
  )
  select * from mejores order by puntos desc, creado limit least(greatest(p_limite, 1), 100);
$$;
grant execute on function ranking(text, text, int) to anon, authenticated;

-- Privacidad: las puntuaciones de más de 6 meses se borran (ejecutar a mano o con pg_cron)
create or replace function limpiar_puntuaciones() returns void
language sql security definer set search_path = public as $$
  delete from puntuaciones where creado < now() - interval '6 months';
$$;
-- Con pg_cron activado (Database → Extensions → pg_cron):
-- select cron.schedule('limpiar-puntuaciones', '0 4 * * *', 'select limpiar_puntuaciones()');

-- ---------- Almacenamiento de fotos ----------
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true) on conflict (id) do nothing;
drop policy if exists "fotos: admin sube" on storage.objects;
create policy "fotos: admin sube" on storage.objects for insert to authenticated with check (bucket_id = 'fotos' and es_admin());
drop policy if exists "fotos: admin cambia" on storage.objects;
create policy "fotos: admin cambia" on storage.objects for update to authenticated using (bucket_id = 'fotos' and es_admin());
drop policy if exists "fotos: admin borra" on storage.objects;
create policy "fotos: admin borra" on storage.objects for delete to authenticated using (bucket_id = 'fotos' and es_admin());

-- ---------- Hacerse administrador ----------
-- 1) Authentication → Users → Add user (email + contraseña, marcar "Auto Confirm User")
-- 2) Ejecutar, cambiando el email:
-- insert into admins (user_id, email) select id, email from auth.users where email = 'dueño@ejemplo.de' on conflict do nothing;
