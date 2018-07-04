const mongoose          = require('mongoose')
const Schema            = mongoose.Schema
const schemaTransaction = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customers'
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'items'
  },
  quantity: {
    type: Number,
    default: 1
  },
}, {
  timestamps: true
})

const Transactions = mongoose.model('transactions', schemaTransaction)

module.exports     = Transactions