import user from '../db/models/user.js';
import { Op } from 'sequelize';


export const createUser = async(req,res,next)=>{
    try{
        if(!['User'].includes(req.body.userType)){
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid User Type'
            })
        }
        const {userType, email,password, confirmPassword} = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords do not match'
            });
        }

        const newUser = await user.create({
            userType: userType,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        })

        if (!newUser){
            return res.status(400).json({
                status: 'fail',
                message: 'Failed to create new user',
            })
        }
        const result = newUser.toJSON();

        res.status(201).json({
            status: 'success',
            data: result
        })
    }
    catch(error){
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
    
}



export const getAllUsers = async(req,res,next)=>{
    try{
        const search = req.query.search || null;
        const sortBy = req.query.sortBy||'createdAt';
        const orderBy = req.query.orderBy||'DESC';
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 5;
        const offset = (page - 1) * limit;

        if(!search){
            const {count, rows} = await user.findAndCountAll({
                                        where: {userType:"User"},
                                        limit: limit, offset:offset,
                                        order:[[sortBy, orderBy]]});
  

            res.status(200).json({
                status: 'success',
                users: rows,
                totalUsers: count,
                page: page,
                limit: limit
        });
        }
        else{
            const {count, rows} = await user.findAndCountAll({
                                            where: {userType:"User", email: {[Op.iLike]: `%${search}%`}},
                                            limit: limit, offset:offset,
                                            order:[[sortBy, orderBy]]});

            res.status(200).json({
                status: 'success',
                users: rows,
                totalUsers: count,
                page: page,
                limit: limit
        });
        }
    }
    catch(error){
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}

export const deleteUser = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const userToDelete = await user.findByPk(id);
        if (!userToDelete) {
            return res.status(404).json({ 
                status: 'fail',
                message: 'User Not found' 
            });
        }
        await user.destroy({where: {userType:'User', id: id}})

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        })
    }
    catch(error){
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}