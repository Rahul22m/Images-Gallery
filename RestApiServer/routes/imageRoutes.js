import {Router} from 'express';
// const multer = require('multer')
// const path = require('path') 

import {uploadImage, getAllImages, getAllUserImages, deleteImage, getAnImage, getAnImageByAdmin, deleteImageByAdmin} from '../controllers/imageController.js';

import {authentication, restrictTo} from '../controllers/authController.js'

const router = Router();

// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null,'uploads/')
//     },
//     filename: (req, file, cb)=>{
//         console.log(file)
//         cb(null, Date.now()+ path.extname(file.originalname))
//     }
// })

// const upload = multer({storage: storage});

// app.use(express.json());

router.post('/images', authentication, restrictTo('Admin', 'User'),uploadImage)

router.get('/images', authentication, restrictTo('Admin', 'User'), getAllImages)

router.get('/images/:imageId', authentication, restrictTo('Admin','User'), getAnImage)


router.get('/allimages', authentication, restrictTo('Admin'), getAllUserImages)

router.get('/allimages/:imageId', authentication, restrictTo('Admin'), getAnImageByAdmin)


router.delete('/images/:id', authentication, restrictTo('Admin','User'), deleteImage)

router.delete('/allimages/:id', authentication, restrictTo('Admin'), deleteImageByAdmin)


// router.get('/images/:id')




export default router;