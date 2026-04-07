// Servicio UI - Funciones de interfaz
const UI = (function() {
    
    function showMessage(message, isError = false) {
        const msgDiv = document.getElementById('formMessage');
        if (msgDiv) {
            msgDiv.textContent = message;
            msgDiv.style.backgroundColor = isError ? 'rgba(211,47,47,0.1)' : 'rgba(76,175,80,0.1)';
            msgDiv.style.color = isError ? '#D32F2F' : '#4CAF50';
            msgDiv.style.padding = '12px';
            msgDiv.style.borderRadius = '12px';
            msgDiv.style.marginTop = '16px';
            msgDiv.style.textAlign = 'center';
            
            setTimeout(() => {
                msgDiv.textContent = '';
            }, 4000);
        }
    }
    
    function resetForm() {
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const telefono = document.getElementById('telefono');
        const servicio = document.getElementById('servicio');
        const ciudad = document.getElementById('ciudad');
        const vehiculo = document.getElementById('vehiculo');
        const hora = document.getElementById('hora');
        
        if (nombre) nombre.value = '';
        if (apellido) apellido.value = '';
        if (telefono) telefono.value = '';
        if (servicio) servicio.selectedIndex = 0;
        if (ciudad) ciudad.selectedIndex = 0;
        if (vehiculo) vehiculo.selectedIndex = 0;
        if (hora) hora.selectedIndex = 0;
        
        const precioDisplay = document.getElementById('precioDisplay');
        if (precioDisplay) precioDisplay.innerHTML = 'RD$0';
    }
    
    function validatePhone(phone) {
        const phoneRegex = /^[+\d\s-]{7,20}$/;
        return phoneRegex.test(phone);
    }
    
    function generateTimeSlots() {
        const select = document.getElementById('hora');
        if (!select) return;
        
        const slots = BUSINESS_CONFIG.utils.generateTimeSlots();
        select.innerHTML = '<option value="" disabled selected>-- Elige un horario --</option>';
        
        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot.value;
            option.textContent = slot.display;
            select.appendChild(option);
        });
    }
    
    // 👈 Generar opciones de ciudad
    function generateCiudades() {
        const select = document.getElementById('ciudad');
        if (!select) return;
        
        select.innerHTML = '<option value="" disabled selected>-- Selecciona tu ciudad --</option>';
        
        BUSINESS_CONFIG.cities.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            select.appendChild(option);
        });
    }
    
    // 👈 Generar opciones de tipo de vehículo
    function generateVehiculos() {
        const select = document.getElementById('vehiculo');
        if (!select) return;
        
        select.innerHTML = '<option value="" disabled selected>-- Selecciona tu vehículo --</option>';
        
        BUSINESS_CONFIG.vehicleTypes.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo;
            option.textContent = vehiculo;
            select.appendChild(option);
        });
    }
    
    // 👈 Generar opciones de servicios
    function generateServicios() {
        const select = document.getElementById('servicio');
        if (!select) return;
        
        select.innerHTML = '<option value="" disabled selected>-- Selecciona un servicio --</option>';
        
        BUSINESS_CONFIG.services.forEach(serv => {
            const option = document.createElement('option');
            option.value = serv.name;
            option.textContent = serv.name;
            select.appendChild(option);
        });
    }
    
    // 👈 Calcular y actualizar precio automáticamente
    function actualizarPrecio() {
        const servicioSelect = document.getElementById('servicio');
        const ciudadSelect = document.getElementById('ciudad');
        const vehiculoSelect = document.getElementById('vehiculo');
        const precioDisplay = document.getElementById('precioDisplay');
        const precioHidden = document.getElementById('precio');
        
        if (!servicioSelect || !ciudadSelect || !vehiculoSelect || !precioDisplay) return;
        
        const servicio = servicioSelect.value;
        const ciudad = ciudadSelect.value;
        const vehiculo = vehiculoSelect.value;
        
        if (!servicio || !ciudad || !vehiculo) {
            precioDisplay.innerHTML = 'RD$0';
            if (precioHidden) precioHidden.value = '';
            return;
        }
        
        const precio = BUSINESS_CONFIG.utils.calcularPrecio(ciudad, servicio, vehiculo);
        
        if (precio > 0) {
            precioDisplay.innerHTML = `RD$${precio.toLocaleString()}`;
            if (precioHidden) precioHidden.value = precio;
        } else {
            precioDisplay.innerHTML = 'RD$0';
            if (precioHidden) precioHidden.value = '';
        }
    }
    
    // 👈 Generar sección de servicios (sin precios)
    function generateServicesGrid() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        
        grid.innerHTML = BUSINESS_CONFIG.services.map(service => `
            <div class="service-card">
                <div class="service-icon"><i class="fas fa-spray-can-sparkles"></i></div>
                <h3>${service.name}</h3>
                <div class="service-description">
                    ${service.description.split('\n').map(line => `<p>${line}</p>`).join('')}
                </div>
                <p class="price-note">💰 Precio varía según ciudad y tipo de vehículo</p>
            </div>
        `).join('');
    }
    
    return {
        showMessage,
        resetForm,
        validatePhone,
        generateTimeSlots,
        generateCiudades,
        generateVehiculos,
        generateServicios,
        actualizarPrecio,
        generateServicesGrid
    };
})();