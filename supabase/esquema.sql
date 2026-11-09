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
  horario jsonb not null default '[]',          -- 7 elementos (0 = domingo): ["17:00", "24:00"] o null si cierra
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
-- Cada partida guardada. El jugador se identifica por su Instagram (sin @, en minúsculas).
create table if not exists puntuaciones (
  id bigint generated always as identity primary key,
  juego text not null,
  instagram text not null check (instagram ~ '^[a-z0-9._]{1,30}$'),
  puntos int not null check (puntos between 0 and 100000),
  oculto boolean not null default false,        -- el admin puede ocultar trampas o insultos
  creado timestamptz not null default now()
);
create index if not exists puntuaciones_fecha on puntuaciones (creado desc);
create index if not exists puntuaciones_instagram on puntuaciones (instagram, creado desc);
alter table puntuaciones enable row level security;
drop policy if exists "puntuaciones: lectura pública de las visibles" on puntuaciones;
create policy "puntuaciones: lectura pública de las visibles" on puntuaciones for select using (not oculto or es_admin());
drop policy if exists "puntuaciones: admin modera" on puntuaciones;
create policy "puntuaciones: admin modera" on puntuaciones for update using (es_admin()) with check (es_admin());
drop policy if exists "puntuaciones: admin borra" on puntuaciones;
create policy "puntuaciones: admin borra" on puntuaciones for delete using (es_admin());
-- No hay política de INSERT: solo se puede puntuar mediante guardar_puntuacion()

-- Cómo se suma el ranking general: 'mejor' = la mejor partida de cada juego; 'suma' = todas las partidas
alter table ajustes add column if not exists ranking_modo text not null default 'mejor';

-- Puntuación máxima creíble de cada juego (lo que pase de aquí es trampa)
create or replace function max_puntos(p_juego text) returns int
language sql immutable as $$
  select case p_juego
    when 'ahorcado' then 4000 when 'memoria' then 1200 when 'quiz' then 1250
    when 'pinata' then 4000 when 'lluvia' then 6000 else 0 end;
$$;

-- Inicio del día / semana (lunes) / mes en hora de Alemania
create or replace function inicio_periodo(p_periodo text) returns timestamptz
language sql stable as $$
  select date_trunc(case p_periodo when 'dia' then 'day' when 'mes' then 'month' else 'week' end,
                    now() at time zone 'Europe/Berlin') at time zone 'Europe/Berlin';
$$;

-- Versiones anteriores (con apodo): se sustituyen
drop function if exists guardar_puntuacion(text, text, text, int, text, boolean);
drop function if exists ranking(text, text, int);

-- Guarda una partida comprobando el código del día, el consentimiento y un límite de envíos.
-- Devuelve 'ok' o un código de error: 'codigo', 'consentimiento', 'juego', 'datos', 'espera'.
create or replace function guardar_puntuacion(
  p_juego text, p_instagram text, p_puntos int, p_codigo text, p_consiente boolean
) returns text
language plpgsql security definer set search_path = public as $$
declare
  v_ig text := lower(regexp_replace(btrim(coalesce(p_instagram, '')), '^@', ''));
  v_pide_codigo boolean;
  v_codigo text;
begin
  if max_puntos(p_juego) = 0 then return 'juego'; end if;
  if not coalesce(p_consiente, false) then return 'consentimiento'; end if;
  if v_ig !~ '^[a-z0-9._]{1,30}$' or p_puntos is null or p_puntos < 0 or p_puntos > max_puntos(p_juego) then return 'datos'; end if;

  select ranking_con_codigo into v_pide_codigo from ajustes where id = 1;
  select codigo_juego into v_codigo from secretos where id = 1;
  if coalesce(v_pide_codigo, false) and coalesce(v_codigo, '') <> ''
     and upper(btrim(coalesce(p_codigo, ''))) <> upper(btrim(v_codigo)) then
    return 'codigo';
  end if;

  -- Límite: como mucho 1 partida cada 20 segundos por Instagram y juego
  if exists (select 1 from puntuaciones where juego = p_juego and instagram = v_ig and creado > now() - interval '20 seconds') then
    return 'espera';
  end if;

  insert into puntuaciones (juego, instagram, puntos) values (p_juego, v_ig, p_puntos);
  return 'ok';
end;
$$;
grant execute on function guardar_puntuacion(text, text, int, text, boolean) to anon, authenticated;

-- Totales de cada jugador en el periodo, sumando todos los juegos
create or replace function ranking_totales(p_periodo text)
returns table (instagram text, puntos bigint, partidas int, juegos int, ultima timestamptz)
language sql stable set search_path = public as $$
  with por_juego as (
    select p.instagram, p.juego,
      case when coalesce((select a.ranking_modo from ajustes a where a.id = 1), 'mejor') = 'suma'
           then sum(p.puntos) else max(p.puntos) end as puntos,
      count(*) as partidas, max(p.creado) as ultima
    from puntuaciones p
    where not p.oculto and p.creado >= inicio_periodo(p_periodo)
    group by p.instagram, p.juego
  )
  select instagram, sum(puntos)::bigint, sum(partidas)::int, count(*)::int, max(ultima)
  from por_juego group by instagram;
$$;

-- Ranking general (top N). A igualdad de puntos va antes quien llegó primero.
create or replace function ranking_global(p_periodo text, p_limite int default 15)
returns table (posicion bigint, instagram text, puntos bigint, partidas int, juegos int)
language sql stable set search_path = public as $$
  select row_number() over (order by t.puntos desc, t.ultima), t.instagram, t.puntos, t.partidas, t.juegos
  from ranking_totales(p_periodo) t
  order by 1 limit least(greatest(p_limite, 1), 100);
$$;
grant execute on function ranking_global(text, int) to anon, authenticated;

-- Posición de un jugador aunque no esté en el top
create or replace function mi_posicion(p_instagram text, p_periodo text)
returns table (posicion bigint, puntos bigint, jugadores bigint)
language sql stable set search_path = public as $$
  select x.pos, x.puntos, x.n from (
    select t.instagram, t.puntos, row_number() over (order by t.puntos desc, t.ultima) as pos, count(*) over () as n
    from ranking_totales(p_periodo) t
  ) x
  where x.instagram = lower(regexp_replace(btrim(coalesce(p_instagram, '')), '^@', ''));
$$;
grant execute on function mi_posicion(text, text) to anon, authenticated;

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
