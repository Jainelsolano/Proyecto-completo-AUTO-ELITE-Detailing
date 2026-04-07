cat > routes/blockRoutes.js << 'EOF'
const express = require('express');
const router = express.Router();
const { getBlocks, blockDay, unblockDay, blockHour, unblockHour } = require('../controllers/blockController');

router.get('/', getBlocks);
router.post('/day', blockDay);
router.delete('/day/:day', unblockDay);
router.post('/hour', blockHour);
router.delete('/hour/:hour', unblockHour);

module.exports = router;
EOF