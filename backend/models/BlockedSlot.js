cat > models/BlockedSlot.js << 'EOF'
const mongoose = require('mongoose');

const blockedSlotSchema = new mongoose.Schema({
    clientId: { type: String, default: 'auto-elite-detailing', index: true },
    type: { type: String, enum: ['day', 'hour'], required: true },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    hour: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
    reason: { type: String, default: 'Bloqueado por administrador' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BlockedSlot', blockedSlotSchema);
EOF