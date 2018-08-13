const Transaction = require('../models/transaction.model')
const Customer    = require('../models/customer.model')
const Item        = require('../models/item.model')

module.exports    = {
  createTransaction(req, res) {
    const {
      item
    } = req.body

    Transaction.insertMany(item)
      .then(transaction => {
        transaction.forEach(data => {
          Customer.findByIdAndUpdate(data.customer, {
              $push: {
                transaction: data._id
              }
            })
            .then(customer => {
              Item.findByIdAndUpdate(data.item, {
                $push: {
                  transaction: data._id
                }
              })
            })
        })
        res.status(200).json({
          message: 'Success Add transaction'
        })

      })
      .catch(err => {
        res.status(400).json({
          message: 'Failed Add Transaction',
          data: err
        })
      })

  },

  viewAllTransaction(req, res) {
    const {
      id
    } = req.headers
    Transaction.find({
        customer: id
      })
      .populate('customer')
      .populate('item')
      .then(result => {
        res.status(200).json({
          message: 'All new transaction data',
          data: result
        })
      })
      .catch(err => {
        res.status(400).json({
          message: 'Not found',
          data: err
        })
      })

  }
}