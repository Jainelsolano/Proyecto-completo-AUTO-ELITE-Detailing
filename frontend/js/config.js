// ============================================
// AUTO ELITE - CONFIGURACIÓN DEL NEGOCIO
// ============================================

const BUSINESS_CONFIG = {
    clientId: "auto-elite-detailing",
    
    business: {
        name: "AUTO ELITE",
        description: "Detailing automotriz a domicilio",
        tagline: "Brillo y elegancia en cada detalle",
        logo: "fas fa-spray-can-sparkles",
        email: "hola@autoelite.com",
        phone: "+52 55 1234 5678",
        whatsapp: "525512345678",
        address: "Servicio a domicilio"
    },
    
    schedule: {
        startHour: 6,
        endHour: 18,
        interval: 30
    },
    
    // 👈 TABLA DE PRECIOS OFICIAL
    prices: {
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
    },
    
    // 👈 SERVICIOS (solo nombres, sin precios)
    services: [
        { id: "basico", name: "BASICO", description: "✓ Lavado exterior\n✓ Aspirado interior\n✓ Limpieza de vidrios\n✓ Limpieza de llantas" },
        { id: "combo-motor", name: "COMBO MOTOR", description: "✓ Lavado exterior\n✓ Aspirado interior\n✓ Limpieza de motor\n✓ Aplicación de protectores" },
        { id: "interior-full", name: "INTERIOR FULL", description: "✓ Limpieza profunda de tapicería\n✓ Limpieza de alfombras\n✓ Limpieza de techo\n✓ Limpieza de plásticos" },
        { id: "combo-elite", name: "COMBO ELITE FULL", description: "✓ Detallado completo exterior\n✓ Detallado completo interior\n✓ Pulido cerámico\n✓ Protección de pintura" }
    ],
    
    // 👈 CIUDADES
    cities: [
        "CAMBITA GARABITOS",
        "SAN CRISTOBAL",
        "SANTO DOMINGO"
    ],
    
    // 👈 TIPOS DE VEHÍCULO
    vehicleTypes: [
        "Carro",
        "Sub/Truck"
    ],
    
    api: {
        url: 'http://localhost:5000/api'
    },
    
    messages: {
        whatsappMessage: (data) => {
            return `Hola 👋, tu cita en AUTO ELITE ha sido agendada 🚗✨

📍 SERVICIO DE DETAILING A DOMICILIO

Cliente: ${data.nombre} ${data.apellido}
Teléfono: ${data.telefono}
📍 Ciudad: ${data.ciudad}
🚗 Vehículo: ${data.vehiculo}
🔧 Servicio: ${data.servicio}
💰 Precio total: RD$${data.precio.toLocaleString()}
⏰ Hora: ${data.hora}

Nos pondremos en contacto contigo para confirmar dirección 📍

*El precio puede variar según condiciones del vehículo*`;
        }
    },
    
    utils: {
        formatTime: (timeValue) => {
            const [h, m] = timeValue.split(':');
            const hour = parseInt(h);
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${m} ${period}`;
        },
        
        generateTimeSlots: () => {
            const slots = [];
            for (let hour = 6; hour <= 18; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    if (hour === 18 && minute === 30) break;
                    const timeValue = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const displayHour = hour % 12 || 12;
                    const period = hour >= 12 ? 'PM' : 'AM';
                    slots.push({ 
                        value: timeValue, 
                        display: `${displayHour}:${minute === 0 ? '00' : minute} ${period}` 
                    });
                }
            }
            return slots;
        },
        
        // 👈 NUEVO: Calcular precio según ciudad, servicio y vehículo
        calcularPrecio: (ciudad, servicio, vehiculo) => {
            // Validar que todos los parámetros existan
            if (!ciudad || !servicio || !vehiculo) return 0;
            
            // Obtener precio de la tabla
            const ciudadPrecios = BUSINESS_CONFIG.prices[ciudad];
            if (!ciudadPrecios) return 0;
            
            const servicioPrecios = ciudadPrecios[servicio];
            if (!servicioPrecios) return 0;
            
            const precio = servicioPrecios[vehiculo];
            return precio || 0;
        },
        
        // 👈 NUEVO: Formatear precio para mostrar
        formatPrice: (precio) => {
            return `RD$${precio.toLocaleString()}`;
        }
    }
};