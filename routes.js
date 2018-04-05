const express = require('express')
const router = express.Router();

const index = require('./routes/index');

function isLoggedIn(req, res, next) {
  if(req.session.key) {
    next();
    return
  }
  res.redirect('/')
}

router.get('/',index.index)
router.post('/login', index.login)
router.get('/home', isLoggedIn, index.home)
module.exports = router;
