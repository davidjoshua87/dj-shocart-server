const bcrypt   = require('bcryptjs')
const Customer = require('../models/customer.model')
const jwt      = require('jsonwebtoken')

module.exports = {
	register(req, res) {
		const {
			fullname,
			email,
			password
		} = req.body

		Customer.create({
				fullname,
				email,
				password
			})
			.then(customerCreate => {
				res.status(200).json({
					message: 'Success registration',
					data: customerCreate
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Failed register',
					data: err
				})
			})

	},
	login(req, res) {
		const {
			email,
			password
		} = req.body

		Customer.findOne({
				email
			})
			.then(customer => {
				if (customer) {
					const payload = {
						id: customer._id,
						role: customer.role
					}

					bcrypt.compare(password, customer.password)
						.then(sign => {
							if (sign) {
								let token = jwt.sign(payload, process.env.SECRET)
								res.status(200).json({
									message: 'Success login',
									id: customer._id,
									fullname: customer.fullname,
									access: token,
									role: customer.role
								})
							} else {
								res.status(400).json({
									message: 'Email and Password doesnt match'
								})
							}
						})
				} else {
					res.status(400).json({
						message: 'Customer not found'
					})
				}
			})
			.catch(error => {
				res.status(400).json({
					message: 'Login Failed'
				})
			})
	}
}