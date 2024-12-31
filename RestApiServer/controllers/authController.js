import bcrypt from 'bcrypt';
import user from '../db/models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: `${process.cwd()}/.env` });


const generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

export const signup = async(req,res,next)=>{
    try{
        if(!['User'].includes(req.body.userType)){
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid User Type'
            })
        }

        const {userType, email, password, confirmPassword} = req.body;

       
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
            confirmPassword: confirmPassword,
        })

        if(!newUser){
            return res.status(400).json({
                status: 'fail',
                message: 'Failed to create user'
            })
        }

        const result  = newUser.toJSON();
        
        delete result.password;
        delete result.deletedAt;

        res.status(201).json({
            status: 'success',
            data: result
        })
    }
    catch(error){
        
        return res.status(500).json({
            message: error.message,
        })
    }
}

export const login = async(req,res,next)=>{
    try{
        const {email, password} = req.body;

        if(!email||!password){
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide required email and password credentials'
            })
        }

        const verifyEmail = await user.findOne({where:{email: email}})

        if(!verifyEmail){
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email'
            })
        }

        const verifyPassword = await bcrypt.compare(password, verifyEmail.password);

        if(!verifyPassword){
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect password'
            })
        }
        
        const token = generateToken({
            id: verifyEmail.id,
        });
        
        res.status(201).json({
            status:'success',
            token: token,
            id: verifyEmail.id,
            userType: verifyEmail.userType,
           })
    }
    catch(error){
        return res.status(500).json({
            status: 'fail',
            message: error.message,
        })
    }
}

export const authentication = async(req,res,next)=>{
    let idToken ='';

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        idToken = req.headers.authorization.split(' ')[1];
    }
    if(!idToken){
        return res.status(401).json({
            status: 'fail',
            message: 'Please login to get access'
        })
    }

    const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY)
    console.log(tokenDetail);

    //3.get the user detail from db and add to req object
    const freshUser = await user.findByPk(tokenDetail.id);

    if(!freshUser){
        return next(res.status(400).json({
            status: 'failed',
            message: 'User no longer exists',
        }));
    }
    req.user = freshUser;
    req.tokenDetail = tokenDetail;
    return next();
};

export const restrictTo= (...userType)=>{
    const checkPermission = (req,res,next)=>{
        if(!req.user||!userType.includes(req.user.userType.toString())){
            return next(
                res.status(403).json({
                    status: 'failed',
                    message: "You don't have permisson to access",
                })
            );
        }
        return next();
    };
    return checkPermission;
};

export const logout = async (req, res, next) => {
    try{
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully. Please remove your token from storage.'
        });
    }
    catch(error){
        return res.status(500).json({
            status: 'failed',
            message: error.message
        })
    }
};
