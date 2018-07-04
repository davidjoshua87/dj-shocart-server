const router = require('express').Router()
const {
  authentication
} = require('../middlewares/auth')
const {
  createTransaction,
  viewAllTransaction,
} = require('../controllers/transaction.controller')

router.post('/', authentication, createTransaction)
router.get('/', authentication, viewAllTransaction)

module.exports = router;