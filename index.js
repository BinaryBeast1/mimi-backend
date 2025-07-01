const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 🎯 Configura tu conexión a Neon
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_Bg7MYzEc8IXU@ep-lucky-tooth-a8pi5e2w-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require',
});

// Middleware para mostrar las peticiones
app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando con PostgreSQL (Neon.tech)');
});

// 📥 Ruta POST para guardar datos
app.post('/nfc', async (req, res) => {
  const { uid, tiempo } = req.body;

  if (!uid || isNaN(Number(tiempo))) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO registros (uid, tiempo) VALUES ($1, $2) RETURNING *',
      [uid, Number(tiempo)]
    );
    console.log('✅ Registro guardado:', resultado.rows[0]);
    res.status(201).json({ message: 'Datos guardados con éxito.' });
  } catch (error) {
    console.error('❌ Error al guardar en PostgreSQL:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// 📤 Ruta GET para obtener últimos 10 registros
app.get('/registros', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM registros ORDER BY fecha DESC LIMIT 10'
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('❌ Error al obtener registros:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// 🚀 Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

