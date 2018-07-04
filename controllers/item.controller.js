const Item    = require('../models/item.model')
const Storage = require('@google-cloud/storage')
const storage = new Storage({
	projectId: process.env.GCLOUD_PROJECT,
	keyFilename: process.env.KEYFILE_PATH
})
const bucket = storage.bucket(process.env.CLOUD_BUCKET)

module.exports = {
	addItem(req, res) {
		const {
			name,
			price,
			stock,
			category
		} = req.body
		Item.create({
				name,
				price,
				stock,
				category,
				link: req.file.cloudStoragePublicUrl
			})
			.then(itemAdd => {
				res.status(200).json({
					message: 'Success add item',
					data: itemAdd
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Failed add item',
					data: err
				})
			})
	},
	getListItem(req, res) {
		Item.find()
			.then(listItem => {
				res.status(200).json({
					message: 'Get list item',
					data: listItem
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Failed get list item',
					data: err
				})
			})
	},
	findByCategory(req, res) {
		let category = req.params.category;
		Item.find({
			category: category
		}).then((items) => {
			res.status(200).send({
				message: 'Success find items by category',
				data: items,
			});
		}).catch((err) => {
			res.status(400).send({
				message: 'Fail to find by category',
				data: err
			});
		});
	},
	searchItem: (req, res) => {
		let titleQuery = req.query.name
		let upper = titleQuery.charAt(0).toUpperCase() + titleQuery.substr(1).toLowerCase();
		Item.find({
			name: {
				$regex: '.*' + upper + '.*'
			}
		}, (err, item) => {
			if (err) {
				res.status(400).send({
					message: 'failed to get item'
				})
			} else {
				res.status(200).send({
					message: 'item was succesfuly got',
					data: item
				})

			}
		})
	},
	searchCategory: (req, res) => {
		let titleQuery = req.query.category
		Item.find({
			category: {
				$regex: '.*' + titleQuery + '.*'
			}
		}, (err, item) => {
			if (err) {
				res.status(400).send({
					message: 'failed to get item'
				})
			} else {
				res.status(200).send({
					message: 'item was succesfuly got',
					data: item
				})

			}
		})
	},
	updateItem(req, res) {
		Item.findByIdAndUpdate(req.params.itemId, req.body)
			.then(itemUpdate => {
				res.status(200).json({
					message: 'Success Update',
					data: itemUpdate
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Fail to update',
					data: err
				})
			})
	},
	updateItemStock(req, res) {
		console.log(req.body, '====')
		Item.findByIdAndUpdate(req.params.itemId, {
			name: req.body.name,
			price: req.body.price,
			stock: req.body.stock,
			category: req.body.category
		})
			.then(itemUpdate => {
				res.status(200).json({
					message: 'Success Update',
					data: itemUpdate
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Fail to update',
					data: err
				})
			})
	},
	deleteItem(req, res) {
		Item.findByIdAndRemove(req.params.itemId)
			.then(removeItem => {
				let fileName = removeItem.link.substr(removeItem.link.lastIndexOf('/') + 1)
				bucket.file(fileName).delete()
				res.status(200).json({
					message: 'Success Delete',
					data: removeItem
				})
			})
			.catch(err => {
				res.status(400).json({
					message: 'Fail to Delete',
					data: err
				})
			})
	}
}