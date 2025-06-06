const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 💾 Conexión a MongoDB
mongoose.connect('mongodb+srv://mimi_user:5Ff5vS1eNPgRhLKg@cluster0.prnyzcd.mongodb.net/nfc_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error de conexión', err));

// 📄 Esquema y modelo
const RegistroSchema = new mongoose.Schema({
  uid: String,
  tiempo: Number,
  fecha: { type: Date, default: Date.now }
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});


const Registro = mongoose.model('Registro', RegistroSchema);

// 📥 Ruta POST para recibir datos del ESP32
app.post('/nfc', async (req, res) => {
  try {
    const { uid, tiempo } = req.body;
    if (!uid || typeof tiempo !== 'number') {
      return res.status(400).json({ error: 'Datos inválidos' });
    }

    const nuevoRegistro = new Registro({ uid, tiempo });
    const resultado = await nuevoRegistro.save();

    console.log('Documento guardado:', resultado); // <--- Aquí

    res.status(201).json({ message: 'Datos guardados con éxito.' });
  } catch (error) {
    console.error('Error guardando los datos:', error);
    res.status(500).json({ error: 'Error guardando los datos' });
  }
});

// 🚀 Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
