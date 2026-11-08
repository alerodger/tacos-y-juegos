// Configuración pública. La clave de Supabase que va aquí es la "anon / publishable":
// es pública por diseño (la seguridad está en las políticas RLS). NUNCA poner la service_role.
window.CE = window.CE || {};

CE.config = {
  supabaseUrl: '',   // p. ej. https://xxxx.supabase.co  (vacío = datos de ejemplo)
  supabaseKey: '',
  // Mientras se prueba en GitHub Pages la web no se indexa en buscadores (ver <meta robots>).
};
