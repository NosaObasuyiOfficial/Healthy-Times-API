import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel'

/* -----------------------------------GET ALL BLOG POST WITH SEARCH----------------------------------------*/

export const get_all_posts_with_search = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){
            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if(user_validation){
                const user_role = user_validation.role
        
                    if(user_role === "user"){
                        const { title } = req.body

                       const all_posts = []
                       const all_user_posts:any = []

                     
                       const all_posts_info = await User.findAll()

                       for( const key of all_posts_info){
                        all_posts.push(key.dataValues.posts)
                       }
                       
                        all_posts.map((all_posts) => {
                        if(all_posts.length > 0){
                            all_posts.map((post) => {
                                all_user_posts.push(post)
                            })
                        }
                      })
                      if(all_user_posts.length === 0){
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        })  
                      }else{

                        const one_post = all_user_posts.filter((p:any) => p.title.toLowerCase().includes(title.toLowerCase().trim()))

                        //Pagination Code
                        const page:any = req.query.page || 1
                        const perPage = 10

                        const pageInt = parseInt(page, 10) || 1;;
                        const startIndex = (pageInt - 1) * perPage;
                        const endIndex = startIndex + perPage;
                        const paginatedPosts = one_post.slice(startIndex, endIndex);

                        if(one_post.length > 0){
                               const target_post = one_post
                                return res.status(200).json({
                                    message: `SUCCESSFUL ✅ ✅`,
                                    data: paginatedPosts,
                                    pageInfo: {
                                        currentPage: pageInt,
                                        perPage,
                                        totalPosts: target_post.length
                                    }
                                })
                        }else if(one_post.length < 1){
                            return res.status(200).json({
                                message: `😢 There are no posts with titled - ${title}`
                            })  
                        }
                      }  
                    }else{
                        return res.status(400).json({
                            message: `You are not a registered as a user.`
                        })
                    }
            }else{
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            })
        }
    
    }catch(error){
        console.error("Error getting all post with search:", error);
        return res.status(500).json({ error: "Internal server error - Error getting all post" });  
    }
}

/* -----------------------------------GET ALL BLOG POSTS----------------------------------------*/

export const get_all_posts = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){
            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if(user_validation){
                const user_role = user_validation.role
        
                    if(user_role === "user"){
                        const { title } = req.body

                       const all_posts = []
                       const all_user_posts:any = []
                       const all_posts_info = await User.findAll()
                       for( const key of all_posts_info){
                        all_posts.push(key.dataValues.posts)
                       }
                       
                        all_posts.map((all_posts) => {
                        if(all_posts.length > 0){
                            all_posts.map((post) => {
                                all_user_posts.push(post)
                            })
                        }
                      })
                      if(all_user_posts.length === 0){
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        })  
                      }else{

                        //Pagination Code
                        const page:any = req.query.page || 1
                        const perPage = 10

                        const pageInt = parseInt(page, 10) || 1;;
                        const startIndex = (pageInt - 1) * perPage;
                        const endIndex = startIndex + perPage;
                        const paginatedPosts = all_user_posts.slice(startIndex, endIndex);

                        return res.status(200).json({
                            message: `✅ ✅ SUCCESSFUL`,
                            data: paginatedPosts,
                            pageInfo: {
                                currentPage: pageInt,
                                perPage,
                                totalPosts: all_user_posts.length                         
                            }
                        })  
                      }  
                    }else{
                        return res.status(400).json({
                            message: `You are not a registered as a user.`
                        })
                    }
            }else{
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            })
        }
    
    }catch(error){
        console.error("Error getting all post:", error);
        return res.status(500).json({ error: "Internal server error - Error getting all post" });  
    }
}


/* -----------------------------------GET SINGLE BLOG POST----------------------------------------*/
export const get_single_post = async(req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        const token_info = token.split(" ")[1];
        const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);

        if(decodedToken){
            const user_id = decodedToken.id

            const user_validation:any = await User.findOne({
                where: {
                    id: user_id
                }
            })

            if(user_validation){
                const user_role = user_validation.role
        
                    if(user_role === "user"){
                        const { title } = req.body

                       const all_posts = []
                       const all_user_posts:any = []
                       const all_posts_info = await User.findAll()
                       for( const key of all_posts_info){
                        all_posts.push(key.dataValues.posts)
                       }
                       
                        all_posts.map((all_posts) => {
                        if(all_posts.length > 0){
                            all_posts.map((post) => {
                                all_user_posts.push(post)
                            })
                        }
                      })
                      if(all_user_posts.length === 0){
                        return res.status(200).json({
                            message: `There are NO POSTS to display`
                        })  
                      }else{
                        const one_post = all_user_posts.filter((p:any) => p.title.toLowerCase().includes(title.toLowerCase().trim()))

                        if(one_post.length === 1){
                               const target_post = one_post
                                return res.status(200).json({
                                    message: `SUCCESSFUL ✅ ✅`,
                                    data: target_post
                                })
                        }else if(one_post.length < 1){
                            return res.status(200).json({
                                message: `😢 There are no posts with titled - ${title}`
                            })  
                        }else if(one_post.length > 1){
                            return res.status(200).json({
                                message: `Please provide more information to get specific post`
                            })                          
                        }
                      }  
                    }else{
                        return res.status(400).json({
                            message: `You are not a registered as a user.`
                        })
                    }
            }else{
                return res.status(400).json({
                    message: `User Details NOT FOUND.`
                })
            }
        }else{
            return res.status(500).json({
                message: `Token VERIFICATON FAILED`
            })
        }
    
    }catch(error){
        console.error("Error getting single post:", error);
        return res.status(500).json({ error: "Internal server error - Error getting single post" });  
    }
}


