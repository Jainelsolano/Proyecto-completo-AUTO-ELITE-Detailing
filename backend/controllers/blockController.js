cat > controllers/blockController.js << 'EOF'
const BlockedSlot = require('../models/BlockedSlot');

const getBlocks = async (req, res) => {
    try {
        const blocks = await BlockedSlot.find({ clientId: 'auto-elite-detailing' });
        const blockedDays = blocks.filter(b => b.type === 'day').map(b => b.day);
        const blockedHours = blocks.filter(b => b.type === 'hour').map(b => b.hour);
        res.json({ success: true, blockedDays, blockedHours });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
};

const blockDay = async (req, res) => {
    try {
        const { day } = req.body;
        const exists = await BlockedSlot.findOne({ clientId: 'auto-elite-detailing', type: 'day', day });
        if (exists) return res.status(400).json({ success: false, message: 'Ya bloqueado' });
        await BlockedSlot.create({ clientId: 'auto-elite-detailing', type: 'day', day });
        res.json({ success: true, message: `Día ${day} bloqueado` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
};

const unblockDay = async (req, res) => {
    try {
        const { day } = req.params;
        await BlockedSlot.findOneAndDelete({ clientId: 'auto-elite-detailing', type: 'day', day });
        res.json({ success: true, message: `Día ${day} desbloqueado` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
};

const blockHour = async (req, res) => {
    try {
        const { hour } = req.body;
        const exists = await BlockedSlot.findOne({ clientId: 'auto-elite-detailing', type: 'hour', hour });
        if (exists) return res.status(400).json({ success: false, message: 'Ya bloqueada' });
        await BlockedSlot.create({ clientId: 'auto-elite-detailing', type: 'hour', hour });
        res.json({ success: true, message: `Hora ${hour} bloqueada` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
};

const unblockHour = async (req, res) => {
    try {
        const { hour } = req.params;
        await BlockedSlot.findOneAndDelete({ clientId: 'auto-elite-detailing', type: 'hour', hour });
        res.json({ success: true, message: `Hora ${hour} desbloqueada` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error' });
    }
};

module.exports = { getBlocks, blockDay, unblockDay, blockHour, unblockHour };
EOF