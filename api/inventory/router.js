const router = require('express').Router();
import { 
    addEventInventory,
    getEventInventory,
    updateEventInventory,
    addInventory,
    getInventory,
    getEventInventoryCount
} from "./service";

// ### EVENT SPONSORS
router.post('/', addInventory);
router.get('/', getInventory);
router.post('/ev', addEventInventory);
router.get('/ev', getEventInventory);
router.get('/ev/count', getEventInventoryCount);
// router.delete('/:eventInventoryId', deleteEventInventory);
router.patch('/ev/:id', updateEventInventory);

module.exports = router;