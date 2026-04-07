const Appointment = require('../models/Appointment');
const BlockedSlot = require('../models/BlockedSlot');

// 👈 TABLA DE PRECIOS (misma que en frontend)
const PRICE_TABLE = {
    "CAMBITA GARABITOS": {
        "BASICO": { "Carro": 2000, "Sub/Truck": 2500 },
        "COMBO MOTOR": { "Carro": 3000, "Sub/Truck": 3500 },
        "INTERIOR FULL": { "Carro": 4500, "Sub/Truck": 4800 },
        "COMBO ELITE FULL": { "Carro": 6800, "Sub/Truck": 7500 }
    },
    "SAN CRISTOBAL": {
        "BASICO": { "Carro": 2750, "Sub/Truck": 3200 },
        "COMBO MOTOR": { "Carro": 3400, "Sub/Truck": 3800 },
        "INTERIOR FULL": { "Carro": 4800, "Sub/Truck": 5300 },
        "COMBO ELITE FULL": { "Carro": 7300, "Sub/Truck": 8300 }
    },
    "SANTO DOMINGO": {
        "BASICO": { "Carro": 3000, "Sub/Truck": 3500 },
        "COMBO MOTOR": { "Carro": 3600, "Sub/Truck": 4000 },
        "INTERIOR FULL": { "Carro": 5000, "Sub/Truck": 5500 },
        "COMBO ELITE FULL": { "Carro": 7500, "Sub/Truck": 8500 }
    }
};

// 👈 Función para validar precio
function validarPrecio(ciudad, servicio, vehiculo, precioEnviado) {
    const ciudadPrecios = PRICE_TABLE[ciudad];
    if (!ciudadPrecios) return false;
    
    const servicioPrecios = ciudadPrecios[servicio];
    if (!servicioPrecios) return false;
    
    const precioCorrecto = servicioPrecios[vehiculo];
    if (!precioCorrecto) return false;
    
    return precioEnviado === precioCorrecto;
}

const createAppointment = async (req, res) => {
    try {
        const { nombre, apellido, telefono, hora, servicio, ciudad, vehiculo, precio } = req.body;
        const clientId = 'auto-elite-detailing';
        const fecha = new Date().toISOString().split('T')[0];
        
        // Validar datos básicos
        if (!nombre || !apellido || !telefono || !hora || !servicio || !ciudad || !vehiculo) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }
        
        // 👈 VALIDAR PRECIO (evita manipulación)
        if (!validarPrecio(ciudad, servicio, vehiculo, parseInt(precio))) {
            return res.status(400).json({
                success: false,
                message: 'Precio inválido. Por favor recarga la página y vuelve a intentar.'
            });
        }
        
        // 1. VALIDAR DÍA BLOQUEADO
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const dayName = dayNames[today.getDay()];
        
        const dayBlocked = await BlockedSlot.findOne({ clientId, type: 'day', day: dayName });
        if (dayBlocked) {
            return res.status(400).json({
                success: false,
                message: 'Hoy no hay servicio. Por favor selecciona otro día.'
            });
        }
        
        // 2. VALIDAR HORA BLOQUEADA
        const hourBlocked = await BlockedSlot.findOne({ clientId, type: 'hour', hour: hora });
        if (hourBlocked) {
            return res.status(400).json({
                success: false,
                message: 'Esta hora no está disponible. Por favor selecciona otro horario.'
            });
        }
        
        // 3. VALIDAR CITA DUPLICADA
        const existingAppointment = await Appointment.findOne({
            clientId,
            fecha,
            hora
        });
        
        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Esta hora ya está ocupada. Por favor selecciona otro horario.'
            });
        }
        
        // Crear la cita
        const appointment = new Appointment({
            clientId,
            nombre,
            apellido,
            telefono,
            hora,
            fecha,
            servicio,
            ciudad,
            vehiculo,
            precio: parseInt(precio)
        });
        
        await appointment.save();
        
        res.status(201).json({
            success: true,
            data: appointment,
            message: 'Cita agendada correctamente'
        });
    } catch (error) {
        console.error('Error al crear cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al agendar cita',
            error: error.message
        });
    }
};

const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ clientId: 'auto-elite-detailing' }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Error al obtener citas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener citas',
            error: error.message
        });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await Appointment.findByIdAndDelete(id);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Cita eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar cita',
            error: error.message
        });
    }
};

module.exports = {
    createAppointment,
    getAppointments,
    deleteAppointment
};