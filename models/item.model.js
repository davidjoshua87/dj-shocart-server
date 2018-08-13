const mongoose   = require('mongoose')
const Schema     = mongoose.Schema
const schemaItem = new Schema({
  name: {
    type: String,
    required: [true, "Column item cannot be empty"]
  },
  price: {
    type: Number,
    required: [true, 'Column price cannot be empty']
  },
  stock: {
    type: Number,
    required: [true, 'Column quantity cannot be empty']
  },
  category: {
    type: String,
    required: [true, 'Choose one category']
  },
  link: {
    type: String,
    default: 'https://jnaengineering.co.za/images/no_product.png'
  },
  transaction: [{
    type: Schema.Types.ObjectId,
    ref: 'transactions'
  }],
}, {
  timestamps: true
})

const Items    = mongoose.model('items', schemaItem)

module.exports = Items