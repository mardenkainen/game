const Router=require('express')
const router=new Router()
const userController=require('../controlers/userController')
const authenticationMiddleware=require('../middleware/authenticationMiddleware')

router.post('/registration', userController.registration)
router.post('/login',userController.login)
router.get('/auth',authenticationMiddleware,userController.check)
router.get('/all', userController.getAll)

module.exports = router