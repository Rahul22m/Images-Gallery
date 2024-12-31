import image from '../db/models/image.js';
import { Op } from 'sequelize';


export const uploadImage = async (req, res, next) => {
    const userId = req.tokenDetail.id;
    const { dataUri, title, description } = req.body;


    if (!dataUri || !title || !description) {
        return res.status(400).json({
            message: 'Invalid request. Please provide a valid datauri and title'
        })
    }

    try {
        const newImage = await image.create({
            userId: userId,
            dataUri: dataUri,
            title: title,
            description: description,
        })
        res.status(201).json({
            status: 'success',
            image: newImage,
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
};

export const getAllImages = async (req, res) => {
    try {
        const search = req.query.search|| null;
        const sortBy = req.query.sortBy||'createdAt';
        const orderBy = req.query.orderBy||'ASC';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const offset = (page - 1) * limit;

        const userId = req.tokenDetail.id;

        console.log('sortBy:', sortBy, 'orderBy:', orderBy, "search:", search);

        if(!search){
            const { count, rows } = await image.findAndCountAll({
                where: { userId: userId },
                limit: limit,
                offset: offset,
                order:[[sortBy, orderBy]]
            });
            res.status(200).json({
                status: 'success',
                images: rows,
                totalImages: count,
                page: page,
                limit: limit
            })
        }
        else{
            const { count, rows } = await image.findAndCountAll({
                where: { userId: userId, title: {[Op.iLike]: `%${search}%`}},
                limit: limit,
                offset: offset,
                order:[[sortBy, orderBy]]
            });
            res.status(200).json({
                status: 'success',
                images: rows,
                totalImages: count,
                page,
                limit
            })
        }
        
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}

export const getAnImage = async (req, res, next) => {
    try {
        const imageId = req.params.imageId;

        const userId = req.tokenDetail.id;

        const result = await image.findOne({where : {userId: userId, id: imageId}});

        if (!result) {
            return res.status(400).json({
                status: 'fail',
                message: 'Not found'
            })
        }

        res.status(200).json({
            image: result,
        })
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}

export const getAnImageByAdmin = async(req, res, next) =>{
    try{
        const imageId = req.params.imageId;

        const result = await image.findOne({where:{id: imageId}})

        if(!result){
            return res.status(400).json({
                status: 'fail',
                message: 'Not found'
            })
        }

        res.status(200).json({
            image: result,
        })
    }
    catch(error){
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}

export const getAllUserImages = async (req, res, next) => {
    try {
        const search = req.query.search || null;
        const sortBy = req.query.sortBy||'createdAt';
        const orderBy = req.query.orderBy||'DESC';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const offset = (page - 1) * limit;


        console.log('sortBy:', sortBy, 'orderBy:', orderBy);

        if(!search){
            const { count, rows } = await image.findAndCountAll({
                                    limit: limit, 
                                    offset:offset,
                                    order:[[sortBy, orderBy]]
                                })

            res.status(200).json({
                status: 'success',
                images: rows,
                totalImages: count,
                page: page,
                limit: limit
            })
        }
        else{
            const { count, rows } = await image.findAndCountAll({
                                        where: {title: {[Op.iLike]: `%${search}%`}},
                                        limit: limit, offset:offset,
                                        order:[[sortBy, orderBy]]})

            res.status(200).json({
                status: 'success',
                images: rows,
                totalImages: count,
                page: page,
                limit: limit
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message
        })
    }
}

export const deleteImage = async (req, res, next) => {
    try {
        const userId = req.tokenDetail.id;
        const id = req.params.id;

        const imageToDelete = await image.findOne({ where: { userId: userId, id: id } })

        if (!imageToDelete) {
            return res.status(400).json({
                status: 'fail',
                message: 'Image not found'
            })
        }

        await image.destroy({ where: { userId: userId, id: id } });

        res.status(200).json({
            status: 'success',
            message: 'Image deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
}

export const deleteImageByAdmin = async (req, res, next) => {
    try {
        // const userId = req.tokenDetail.id;
        const id = req.params.id;

        const imageToDelete = await image.findOne({ where: {id: id } })

        if (!imageToDelete) {
            return res.status(400).json({
                status: 'fail',
                message: 'Image not found'
            })
        }

        await image.destroy({ where: {id: id } });

        res.status(200).json({
            status: 'success',
            message: 'Image deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        });
    }
}
