// Servicio de validaciones
const ValidationService = (function() {
    
    function validatePhone(phone) {
        const phoneRegex = /^[+\d\s-]{7,20}$/;
        return phoneRegex.test(phone);
    }
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateName(name) {
        return name && name.trim().length >= 2;
    }
    
    function validateHour(hour) {
        if (!hour) return false;
        const hourRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return hourRegex.test(hour);
    }
    
    function validateRequired(data, requiredFields) {
        const missing = requiredFields.filter(field => !data[field]);
        if (missing.length > 0) {
            return { 
                valid: false, 
                missing, 
                message: `Campos requeridos: ${missing.join(', ')}` 
            };
        }
        return { valid: true };
    }
    
    return {
        validatePhone,
        validateEmail,
        validateName,
        validateHour,
        validateRequired
    };
})();