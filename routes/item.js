const {
  addItem,
  getListItem,
  findByCategory,
  findBySearch,
  updateItem,
  deleteItem
} = require('../controllers/item.controller')
const router = require('express').Router(),
  images = require('../helpers/images')
const {
  authentication,
  authorization
} = require('../middlewares/auth')

router.post('/upload', authentication, authorization,
  images.multer.single('image'),
  images.sendUploadToGCS,
  (req, res) => {
    res.send({
      status: 200,
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    })
  })

router.post('/', authentication, authorization, images.multer.single('image'), images.sendUploadToGCS, addItem)
router.get('/view', getListItem)
router.get('/search', findBySearch)
router.get('/category', findByCategory)
router.put('/:itemId', authentication, authorization, updateItem)
router.put('/update/:itemId', authentication, updateItem)
router.delete('/:itemId', authentication, authorization, deleteItem)

module.exports = router;