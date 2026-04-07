const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    clientId: {
        type: String,
        default: 'auto-elite-detailing',
        index: true
    },
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    telefono: { type: String, required: true, trim: true },
    hora: { type: String, required: true },
    
    // 👈 NUEVOS CAMPOS
    servicio: { type: String, required: true },
    ciudad: { type: String, required: true },
    vehiculo: { type: String, required: true },
    precio: { type: Number, required: true },
    
    fecha: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    createdAt: { type: Date, default: Date.now }
});

appointmentSchema.index({ clientId: 1, fecha: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Appointment', appointmentSchema);