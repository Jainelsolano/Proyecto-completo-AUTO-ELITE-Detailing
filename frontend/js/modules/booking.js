// Módulo de reservas
const BookingModule = (function() {
    let isSubmitting = false;
    
    function init() {
        const form = document.getElementById('appointmentForm');
        if (form) {
            form.addEventListener('submit', handleSubmit);
        }
        
        UI.generateTimeSlots();
        UI.generateServicesGrid();
        UI.generateCiudades();
        UI.generateVehiculos();
        UI.generateServicios();
        
        // Eventos para actualizar precio automáticamente
        const servicioSelect = document.getElementById('servicio');
        const ciudadSelect = document.getElementById('ciudad');
        const vehiculoSelect = document.getElementById('vehiculo');
        
        if (servicioSelect) servicioSelect.addEventListener('change', UI.actualizarPrecio);
        if (ciudadSelect) ciudadSelect.addEventListener('change', UI.actualizarPrecio);
        if (vehiculoSelect) vehiculoSelect.addEventListener('change', UI.actualizarPrecio);
    }
    
    async function handleSubmit(e) {
        e.preventDefault();
        if (isSubmitting) return;
        
        const nombre = document.getElementById('nombre')?.value.trim();
        const apellido = document.getElementById('apellido')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const servicio = document.getElementById('servicio')?.value;
        const ciudad = document.getElementById('ciudad')?.value;
        const vehiculo = document.getElementById('vehiculo')?.value;
        const hora = document.getElementById('hora')?.value;
        const precio = document.getElementById('precio')?.value;
        
        // Validaciones
        if (!nombre || !apellido || !telefono || !hora || !servicio || !ciudad || !vehiculo) {
            UI.showMessage('❌ Todos los campos son obligatorios', true);
            return;
        }
        
        if (!UI.validatePhone(telefono)) {
            UI.showMessage('📱 Ingresa un teléfono válido (mínimo 7 caracteres)', true);
            return;
        }
        
        // Validar que el precio sea válido
        if (!precio || parseInt(precio) === 0) {
            UI.showMessage('⚠️ Por favor selecciona ciudad, servicio y tipo de vehículo para calcular el precio', true);
            return;
        }
        
        isSubmitting = true;
        const submitBtn = document.getElementById('submitAppointment');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Procesando...';
        submitBtn.disabled = true;
        
        try {
            const appointmentData = { 
                nombre, 
                apellido, 
                telefono, 
                servicio,
                ciudad,
                vehiculo,
                precio: parseInt(precio),
                hora 
            };
            
            const result = await ApiService.createAppointment(appointmentData);
            
            if (result.success) {
                UI.showMessage('✅ Cita agendada correctamente. ¡Te esperamos!');
                UI.resetForm();
                sendWhatsApp(nombre, apellido, telefono, hora, servicio, ciudad, vehiculo, precio);
            } else {
                UI.showMessage(result.message || 'Error al agendar', true);
            }
        } catch (error) {
            console.error('Error:', error);
            UI.showMessage(error.message || '⚠️ Error al conectar con el servidor', true);
        } finally {
            isSubmitting = false;
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    function sendWhatsApp(nombre, apellido, telefono, hora, servicio, ciudad, vehiculo, precio) {
        const phoneNumber = "525512345678";
        const [h, m] = hora.split(':');
        const hour = parseInt(h);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        const horaFormateada = `${displayHour}:${m} ${period}`;
        
        const mensaje = `Hola 👋, tu cita en AUTO ELITE ha sido agendada 🚗✨

📍 SERVICIO DE DETAILING A DOMICILIO

Cliente: ${nombre} ${apellido}
Teléfono: ${telefono}
📍 Ciudad: ${ciudad}
🚗 Vehículo: ${vehiculo}
🔧 Servicio: ${servicio}
💰 Precio total: RD$${parseInt(precio).toLocaleString()}
⏰ Hora: ${horaFormateada}

Nos pondremos en contacto contigo para confirmar dirección 📍

*El precio puede variar según condiciones del vehículo*`;
        
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`;
        setTimeout(() => {
            window.open(url, '_blank');
        }, 500);
    }
    
    return {
        init
    };
})();