const express = require('express');

const router = express.Router();
const c = require('../controllers');

// Route Open

router.get('/', c.general.index);
router.get('/staticdata', c.general.staticdata);
router.post('/gmi', c.general.testdata);
router.post('/login', c.auth.login);
router.post('/signup', c.auth.signup);
router.post('/forgot-password', c.user.passwordForgot);
router.post('/send-mail-available-book', c.user.sendMailForAvailableBook);
router.post('/verify-reset-password-token', c.auth.passwordResetTokenValidation);
router.post('/reset-password', c.auth.passwordReset);
router.get('/getallscan', c.general.getscans)
router.get('/books', c.book.index);
router.post('/books', c.book.create);
router.get('/all-users', c.user.getAllUsers);



module.exports = router;
