import axios from 'axios';




export const resolvers = {
    Query: {
            getUserImages: async (_, {search="", sortBy='createdAt', orderBy='DESC', limit=10, page=1}, context)=>{
                try{
                    const response = await axios.get(`http://localhost:3000/images?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`, 
                        {
                            headers: {
                                Authorization: `Bearer ${context.token}`
                            }
                        },
                        {withCredentials: true}
                    );

                    return response.data;
                }
                catch(error){
                    return error;
                }
            },


        getAnImage: async(_, args, context)=>{
            try{
                const id = args.id;

                // if(!context.userId){
                //     console.log('Not authenticated')
                // }

                const response = await axios.get(`http://localhost:3000/images/${id}`, {
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },
                {
                    withCredentials: true

                });

                return response.data.image;
            }
            catch(error){
                console.error('Error fetching image', error);
                return error;
            }
        },

        getAnImageByAdmin: async(_, args, context)=>{
    //         try{
    //             if(!context.userId){
    //                 console.log('Not authenticated')
    //             }
    //             const userId = context.userId;

    //             const freshUser = await user.findByPk(userId)
    //             const userRole =  freshUser.userType;
    //             console.log(userRole)

    //             if(userRole !== 'Admin'){
    //                 return new Error('You have no permission to perform this action');
    //             }

            try{
                const id = args.id;

                // if(!context.userId){
                //     console.log('Not authenticated')
                // }

                const response = await axios.get(`http://localhost:3000/allimages/${id}`, {
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },
                {
                    withCredentials: true

                });

                return response.data.image;
            }
            catch(error){
                console.error('Error fetching image', error);
                return error;
            }
        },

        getUsers: async(_, {search, sortBy='createdAt', orderBy='DESC', limit=10, page=1}, context) => {
            try{
                const response = await axios.get(`http://localhost:3000/users?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`, {
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                });

                return response.data;
            }
            catch(error){
                return error;
            }
             
        },
        getAllUsersImages: async (_, {search, sortBy='createdAt', orderBy='DESC', limit=10, page=1}, context) => {
            try {
                const response = await axios.get(`http://localhost:3000/allimages?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`, {
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                });

                return response.data;

                // const userId =  context.userId;

                // if(!userId){
                //     return new Error('User is not authenticated'); 
                // }
                // const freshUser = await user.findByPk(userId)
                // const userRole =  freshUser.userType;
                // console.log(userRole)

                // if(userRole !== 'Admin'){
                //     return new Error('You have no permission to perform this action');
                // }               
            }
            catch (error) {
                console.error('Error fetching images:', error);
                return error;
            }
        },
      
    },
    Mutation: {
        login: async(_, args)=>{
            try{
                const response = await axios.post('http://localhost:3000/login',{
                    email: args.email,
                    password: args.password,
                }
            );

            return response.data;

            }
            catch(error){
                return error;
            }
            // try{
            //     const person = await user.findOne({where: {email: args.email}});

            //     if(!person){
            //         return new Error('Incorrect email')
            //     }

            //     const valid= await bcrypt.compare(args.password, person.password)

            //     if(!valid){
            //         return new Error('Incorrect password');
            //     }

            //     const token = jwt.sign({id: person.id},  process.env.JWT_SECRET_KEY, {
            //         expiresIn: process.env.JWT_EXPIRES_IN,
            //     })
                
            //     return token;
            // }
            // catch(error){
            //     console.error('Error logging:', error);
            //     return error;
            // }
        },
        
        uploadAnImage: async(_,args, context)=>{
            try{
                const response = await axios.post(`http://localhost:3000/images`, args.image, {
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                } )
                // const userId =  context.userId;

                // if(!userId){
                //     return new Error('User is not authenticated')
                // }

                // args.image.userId = context.userId;
                // const newImage =  await image.create(args.image)

                return response.data;
            }
            catch(error){
                console.error('Error uploading image', error);
                return error;
            }
        },

        deleteAnImage: async(_, args, context)=>{
            try{
                const id = args.id;
                const response = await axios.delete(`http://localhost:3000/images/${id}`, {
                    headers:{
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                });

                return response.data;
            }
            catch(error){
                console.error('Error deleting image', error);
                return error;
            }
        },

        deleteAnImageByAdmin: async(_, args, context) => {
            try{
                const id = args.id;
                const response =  await axios.delete(`http://localhost:3000/allimages/${id}`,{
                    headers: {
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                })

                return response.data;
            }
            catch(error){
                return error;
            }
        },
    //             const userId = context.userId;

    //             if(!userId){
    //                 return new Error('User is not authenticated')
    //             }

    //             const freshUser = await user.findByPk(userId)

    //             const userRole =  freshUser.userType;

    //             if(userRole !== 'Admin'){
    //                 return new Error('You have no permission to perform this action');
    //             }

    //             const result = await image.findOne({ where:{id: args.id } })

    //             if (!result){
    //                 return new Error("Image Not Found")
    //             }

    //             await image.destroy({ where: {id: args.id } });

    //             return 'Image Deleted Successfully';
    //         }
    //         catch(error){
    //             console.error('Error deleting image', error);
    //             return error;
    //         }
    //     },

        deleteUser: async(_, args, context)=>{
            try{
                const id = args.id;

                const response =  axios.delete(`http://localhost:3000/users/${id}`, {
                    headers:{
                        Authorization: `Bearer ${context.token}`
                    }
                },{
                    withCredentials: true
                });
                return (await response).data;
            }
            catch(error){
                return error;
            }
        },

        createUser: async(_, args)=>{
            try{
                const { userType, email, password, confirmPassword } = args.user;
                const newUser = await axios.post('http://localhost:3000/signup', 
                    {
                    userType,
                    email,
                    password,
                    confirmPassword,
                    }, 
                    {
                        withCredentials: true,
                    });

                return newUser.data;
            }
            catch(error){
                console.error('Error creating user:', error);
                return error;
            }
        },
    }
}