
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas conectado'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err.message));

// Middlewares
app.use(cors());
app.use(express.json());

// Modelo de Cita
const appointmentSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    telefono: String,
    hora: String,
    servicio: String,
    fecha: { type: String, default: () => new Date().toISOString().split('T')[0] },
    createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ========== RUTAS ==========

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'AUTO ELITE - API funcionando correctamente',
        status: 'online',
        endpoints: {
            appointments: 'GET/POST /api/appointments',
            delete: 'DELETE /api/appointments/:id'
        }
    });
});

// OBTENER todas las citas
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREAR nueva cita
app.post('/api/appointments', async (req, res) => {
    try {
        const { nombre, apellido, telefono, hora, servicio } = req.body;
        const fecha = new Date().toISOString().split('T')[0];
        
        console.log('📝 Recibida cita:', { nombre, apellido, telefono, hora, fecha });
        
        // Verificar si ya existe una cita en la misma fecha y hora
        const existing = await Appointment.findOne({ fecha, hora });
        if (existing) {
            return res.status(400).json({ 
                success: false, 
                message: 'Esta hora ya está ocupada' 
            });
        }
        
        const appointment = new Appointment({ 
            nombre, 
            apellido, 
            telefono, 
            hora, 
            servicio: servicio || 'Lavado Premium', 
            fecha 
        });
        
        await appointment.save();
        
        console.log('✅ Cita guardada');
        res.status(201).json({ 
            success: true, 
            data: appointment, 
            message: 'Cita agendada correctamente' 
        });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// ELIMINAR cita
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Cita eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor AUTO ELITE corriendo en puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://localhost:${PORT}/api/appointments`);
});
