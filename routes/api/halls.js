const express = require('express');
const router = express.Router();
const hallsController = require('../../controllers/hallsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(hallsController.getAllHalls)
    .post(verifyRoles(ROLES_LIST.Admin), hallsController.createNewHall)
    .put(verifyRoles(ROLES_LIST.Admin), hallsController.updateHall)
    .delete(verifyRoles(ROLES_LIST.Admin), hallsController.deleteHall);

router.route('/:id')
    .get(hallsController.getHall);

module.exports = router;