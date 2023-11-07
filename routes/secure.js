const express = require('express');

const router = express.Router();
const c = require('../controllers');
const m = require('../middleware');

router.get('/role', c.role.index);
router.get('/activitylog', m.requireAdminOrUser, c.activitylog.index);
router.get('/profile', m.requireAdminOrUser, c.user.getDetails);
router.get('/users', m.requireAdmin, c.user.index);
router.post('/user/:UserId', c.userUpdate.update);
router.get('/summon/:StudentId',c.summon.showByStudentId);
router.post('/summon',c.summon.create);
// Let's say the route below is very sensitive and we want only authorized users to have access

router.get('/qr', m.requireAdminOrUser, c.general.qr);

// router.get('/nationalneb', c.nationalneb.index);
// router.post('/nationalneb', c.nationalneb.saveorupdate);

// router.get('/solution-preset-names', m.requireAdmin, c.solutionpreset.presets);
// router.get('/solution-presets/:preset_name?', m.requireAdmin, c.solutionpreset.index);
// router.post('/solution-preset/:id', m.requireAdmin, c.solutionpreset.update);
// router.delete('/solution-preset/:id', m.requireAdmin, c.solutionpreset.destroy);
// router.post('/solution-preset', m.requireAdmin, c.solutionpreset.create);

module.exports = router;
