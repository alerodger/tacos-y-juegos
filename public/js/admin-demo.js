// Modo demostración del panel: un "Supabase" de mentira que guarda todo en este navegador
// (localStorage 'ce-demo-db'). La web pública de este mismo navegador lee esos datos, así que los
// cambios se ven al momento. Sirve para enseñar el panel sin crear la base de datos.
window.CE = window.CE || {};

CE.adminDemo = {
  CLAVE: 'ce-demo-db',
  restablecer() { try { localStorage.removeItem(CE.adminDemo.CLAVE); } catch (e) { /* nada */ } },

  semilla() {
    const d = CE.demo; let n = 1;
    return {
      ajustes: [{ id: 1, ...d.ajustes, ranking_con_codigo: false, ranking_modo: 'mejor' }],
      secretos: [{ id: 1, codigo_juego: 'TACO42' }],
      categorias: d.categorias.map((c, i) => ({ lista: false, ...c, orden: i })),
      platos: d.platos.map((p, i) => ({ id: n++, visible: true, variantes: [], picante: 0, veg: false, vegano: false, destacado: false, foto_ia: false, ...p, orden: i })),
      fotos: d.fotos.map((f, i) => ({ id: n++, ancho: 1, ...f, orden: i })),
      premios: [
        { id: n++, periodo: 'semana', juego: null, texto_es: 'Un chupito de tequila para el número 1 de la semana', texto_de: 'Ein Tequila-Shot für die Nummer 1 der Woche', activo: true, orden: 0 },
        { id: n++, periodo: 'mes', juego: null, texto_es: 'Una ronda de margaritas para tu mesa', texto_de: 'Eine Runde Margaritas für deinen Tisch', activo: true, orden: 1 },
      ],
      opiniones: (d.opiniones || []).map((o, i) => ({ id: n++, visible: true, ...o, orden: i })),
      puntuaciones: [],
      siguiente: n,
    };
  },

  crear() {
    let db;
    try { db = JSON.parse(localStorage.getItem(CE.adminDemo.CLAVE)); } catch (e) { db = null; }
    if (!db) db = CE.adminDemo.semilla();
    const guardar = () => {
      try { localStorage.setItem(CE.adminDemo.CLAVE, JSON.stringify(db)); } catch (e) {
        throw new Error('El navegador no tiene más espacio para la demo. Pulsa "Restablecer demo".');
      }
    };
    guardar();
    // Partidas del ranking demo (las que se juegan en este navegador)
    const partidas = () => {
      let l = [];
      try { l = JSON.parse(localStorage.getItem('ce-demo-partidas')) || []; } catch (e) { /* nada */ }
      return l.map((p, i) => ({ id: `p${i}`, juego: p.juego, instagram: p.instagram, puntos: p.puntos, oculto: false, creado: new Date(p.t).toISOString() }));
    };

    class Consulta {
      constructor(tabla) { this.tabla = tabla; this.filtros = []; this.op = 'select'; }
      select() { return this; }
      eq(c, v) { this.filtros.push((r) => String(r[c]) === String(v)); return this; }
      gte(c, v) { this.filtros.push((r) => r[c] >= v); return this; }
      order(c, o) { this.orden = [c, o?.ascending !== false]; return this; }
      limit(x) { this.limite = x; return this; }
      maybeSingle() { this.uno = true; return this; }
      update(v) { this.op = 'update'; this.valor = v; return this; }
      insert(v) { this.op = 'insert'; this.valor = v; return this; }
      upsert(v) { this.op = 'upsert'; this.valor = v; return this; }
      delete() { this.op = 'delete'; return this; }
      then(ok, ko) { return Promise.resolve().then(() => this.ejecutar()).then(ok, ko); }
      ejecutar() {
        if (this.tabla === 'puntuaciones' && this.op === 'select') db.puntuaciones = partidas();
        const T = db[this.tabla] || (db[this.tabla] = []);
        const cumple = (r) => this.filtros.every((f) => f(r));
        if (this.op !== 'select') {
          if (this.op === 'insert') [].concat(this.valor).forEach((v) => T.push({ id: db.siguiente++, ...v }));
          if (this.op === 'upsert') [].concat(this.valor).forEach((v) => { const e = T.find((r) => r.id === v.id); if (e) Object.assign(e, v); else T.push(v); });
          if (this.op === 'update') T.filter(cumple).forEach((r) => Object.assign(r, this.valor));
          if (this.op === 'delete') db[this.tabla] = T.filter((r) => !cumple(r));
          guardar();
          return { data: null, error: null };
        }
        let filas = T.filter(cumple).map((r) => ({ ...r }));
        if (this.orden) { const [c, asc] = this.orden; filas.sort((a, b) => ((a[c] ?? 0) > (b[c] ?? 0) ? 1 : -1) * (asc ? 1 : -1)); }
        if (this.limite) filas = filas.slice(0, this.limite);
        return { data: this.uno ? filas[0] || null : filas, error: null };
      }
    }

    const archivos = {};
    const aDataUrl = (blob) => new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(blob); });
    let sesion = { user: { email: 'demo@cantina' } };
    return {
      from: (t) => new Consulta(t),
      rpc: async (fn, a = {}) => {
        if (fn === 'es_admin') return { data: true, error: null };
        if (fn === 'ranking_global') {
          const t = {};
          partidas().forEach((p) => {
            const j = (t[p.instagram] ||= { instagram: p.instagram, porJuego: {}, partidas: 0 });
            j.porJuego[p.juego] = Math.max(j.porJuego[p.juego] || 0, p.puntos); j.partidas++;
          });
          const filas = Object.values(t).map((j) => ({ instagram: j.instagram, puntos: Object.values(j.porJuego).reduce((x, y) => x + y, 0), juegos: Object.keys(j.porJuego).length, partidas: j.partidas }))
            .sort((x, y) => y.puntos - x.puntos).map((f, i) => ({ posicion: i + 1, ...f }));
          return { data: filas.slice(0, a.p_limite || 15), error: null };
        }
        return { data: null, error: null };
      },
      auth: {
        getSession: async () => ({ data: { session: sesion } }),
        signInWithPassword: async ({ email }) => { sesion = { user: { email } }; return { error: null }; },
        signOut: async () => { sesion = null; },
        onAuthStateChange() {},
        resetPasswordForEmail: async () => ({ error: null }),
        updateUser: async () => ({ error: null }),
      },
      storage: {
        from: () => ({
          upload: async (ruta, blob) => { archivos[ruta] = await aDataUrl(blob); return { error: null }; },
          getPublicUrl: (ruta) => ({ data: { publicUrl: archivos[ruta] || '' } }),
          remove: async () => ({ error: null }),
        }),
      },
    };
  },
};
