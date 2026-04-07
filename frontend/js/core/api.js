const ApiService = (function() {
    // 👇 URL DINÁMICA - Funciona en local y producción
    const API_URL = (() => {
        const isProduction = window.location.hostname !== 'localhost' && 
                             !window.location.hostname.includes('127.0.0.1') &&
                             !window.location.hostname.includes('file://');
        
        if (isProduction) {
            // ⚠️ CAMBIA ESTA URL POR LA DE RENDER (después de desplegar)
            return 'https://autoelite-backend-vb5a.onrender.com/api';
        }
        return 'http://localhost:5000/api';
    })();
    
    async function createAppointment(appointmentData) {
        try {
            console.log('📤 Enviando a:', `${API_URL}/appointments`);
            console.log('📦 Datos:', appointmentData);
            
            const response = await fetch(`${API_URL}/appointments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            });
            
            console.log('📥 Status:', response.status);
            
            const text = await response.text();
            console.log('📄 Respuesta raw:', text);
            
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('Error parsing JSON:', e);
                throw new Error('Respuesta del servidor no es JSON válido');
            }
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al agendar cita');
            }
            
            return { success: true, data: data.data, message: data.message || 'Cita agendada correctamente' };
        } catch (error) {
            console.error('❌ Error:', error);
            throw error;
        }
    }
    
    async function getAppointments() {
        try {
            const response = await fetch(`${API_URL}/appointments`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en getAppointments:', error);
            return { success: false, data: [] };
        }
    }
    
    async function deleteAppointment(id) {
        try {
            const response = await fetch(`${API_URL}/appointments/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error en deleteAppointment:', error);
            throw error;
        }
    }
    
    return {
        createAppointment,
        getAppointments,
        deleteAppointment
    };
})();

console.log('✅ ApiService cargado correctamente');
console.log('📍 API_URL:', (() => {
    const isProduction = window.location.hostname !== 'localhost' && 
                         !window.location.hostname.includes('127.0.0.1') &&
                         !window.location.hostname.includes('file://');
    return isProduction ? 'https://autoelite-backend-vb5a.onrender.com' : 'http://localhost:5000/api';
})());