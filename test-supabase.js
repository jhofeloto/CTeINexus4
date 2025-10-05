require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan variables de entorno para Supabase');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Probando conexión a Supabase...');

    // Intentar una consulta simple, como obtener la versión de PostgreSQL
    const { data, error } = await supabase.rpc('version');

    if (error) {
      console.error('Error en la conexión:', error);
    } else {
      console.log('Conexión exitosa. Versión de PostgreSQL:', data);
    }
  } catch (err) {
    console.error('Error inesperado:', err);
  }
}

testConnection();