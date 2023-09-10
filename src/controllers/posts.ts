import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/userModel'
import { Op } from "sequelize";

/* -----------------------------------ADD A POST----------------------------------------*/
export const create_post = async(req:Request, res:Response) => {
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
                const user_name = user_validation.userName
                const posts = user_validation.posts
                    if(user_role === "user"){

                        const { title, article } = req.body

                        const timestamp = new Date().getTime()
                        const date = new Date(timestamp)
                        const year = date.getFullYear().toString().padStart(2, "0")
                        const month = (date.getMonth()+1).toString().padStart(2, "0")
                        const transfer_date = date.getDate().toString().padStart(2, "0")
        
                        const hours = date.getHours().toString().padStart(2, "0")
                        const minutes = date.getMinutes().toString().padStart(2, "0")
                        const seconds = date.getSeconds().toString().padStart(2, "0")

                        const user_post = {
                            title,
                            by:user_name,
                            posted_At:`${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            article,
                            no_of_comments: 0,
                            comments:[],
                            no_of_likes: 0,
                            likes: []
                        }

                        posts.push(user_post)

                        const post_update = await User.update(
                            { posts: posts },
                            {
                                where: {
                                    [Op.and]: [
                                       { id: user_id  },
                                          { userName: user_name }
                                     ]
                                }
                            }
                          );

                    const user_data = await User.findOne({
                        where:{
                            id: user_id
                        }
                    })

                    return res.status(200).json({
                        message: `Post CREATED`,
                        data: user_data
                    })

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
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error - Error creating post" });  
    }
}

/* -----------------------------------COMMENT ON A POST----------------------------------------*/
export const make_comments = async(req:Request, res:Response)=> {

    try{
        const token: any = req.headers.authorization
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
    
            if(decodedToken){
                const user_id = decodedToken.id

                const user_validation:any = await User.findOne({
                    where: {
                        id:user_id
                    }
                })

                if(user_validation){
                    const { comment, userName, title } = req.body


                    const timestamp = new Date().getTime()
                    const date = new Date(timestamp)
                    const year = date.getFullYear().toString().padStart(2, "0")
                    const month = (date.getMonth()+1).toString().padStart(2, "0")
                    const transfer_date = date.getDate().toString().padStart(2, "0")
    
                    const hours = date.getHours().toString().padStart(2, "0")
                    const minutes = date.getMinutes().toString().padStart(2, "0")
                    const seconds = date.getSeconds().toString().padStart(2, "0")
                    
                    const user_Name = user_validation.userName

                    const author_info:any = await User.findOne({
                        where: {userName:userName.trim()}
                    })
                    const user_posts = author_info.dataValues.posts

                    const targeted_post = user_posts.filter((post:any) => post.title === title.trim())
                    console.log(`${targeted_post[0].by} with ${user_Name}`)

                    let commented_post:any = []
                    if(targeted_post[0].by === user_Name){

                        const user_comment = {
                            user_name: user_Name + " " + "*author*",
                            At: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            comment: comment.trim()
                        }

                        targeted_post[0].comments.push(user_comment)
                        targeted_post[0].no_of_comments+=1
                        commented_post.push(targeted_post[0])

                    }else{
                        const user_comment = {
                            user_name: user_Name,
                            At: `${year}-${month}-${transfer_date} ${hours}:${minutes}:${seconds}`,
                            comment: comment.trim()
                        }

                        targeted_post[0].comments.push(user_comment)
                        targeted_post[0].no_of_comments+=1
                        commented_post.push(targeted_post[0])
                    }

                    await User.update({ posts: user_posts }, { where: { userName:userName.trim() } });

                    return res.status(200).json({
                        message: `COMMENT POSTED ✅`,
                        data: commented_post
                    })

                }else{
                    return res.status(400).json({
                        message: `User Details NOT FOUND`
                    })
                }
            }else{
                return res.status(500).json({
                    message: `Token VERIFICATON FAILED`
                })
            }
  
    }catch(error){
        console.error("Error making comments:", error);
        return res.status(500).json({ error: "Internal server error - Error making comments" });  
    }
}

/* -----------------------------------LIKE A POST----------------------------------------*/
export const like_a_post = async( req:Request, res:Response) => {
    try{
        const token: any = req.headers.authorization
        if(typeof token !== undefined){
            const token_info = token.split(" ")[1];
            const decodedToken: any = jwt.verify(token_info, process.env.APP_SECRET!);
    
            if(decodedToken){
                const user_id = decodedToken.id

                const user_validation:any = await User.findOne({
                    where: {
                        id:user_id
                    }
                })

                if(user_validation){
                    const { userName, title } = req.body

                    const target_post:any = await User.findOne({
                        where: {
                            userName:userName.trim()
                        }
                    })
                const user_name = user_validation.userName
                const targeted_posts = target_post.posts
                let liked_post:any = []

                    targeted_posts.map(async(p:any) => {
                        for(let key in p){
                            if(p[key] === title.trim()){

                                if(p.likes.length === 0){


                                    p.no_of_likes+=1
                                    p.likes.push(user_name)
                                 
                                    await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });

                                    liked_post.push(p)

                                    return res.status(200).json({
                                        message: `👍 LIKED! ♥️♥️♥️`,
                                        data: liked_post
                                    })
                                }else if(p.likes.length > 0){
                   
                                   const find_user = p.likes.some((like:any) => like === user_name)
                              
                                   if(!find_user){
                                    targeted_posts.map(async(t_post:any) => {
                                        for(let key in t_post){
                                            if(t_post[key] === title.trim()){
                                                t_post.no_of_likes+=1

                                                t_post.likes.push(user_name)
                                                liked_post.push(t_post)

                                                await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });

                                                return res.status(200).json({
                                                    message: `👍 LIKED! ♥️♥️♥️`,
                                                    data: liked_post
                                                })

                                            }
                                        }
                                    })
                                   }else{
                                        p.no_of_likes-=1
                                     
                                        for(let i = 0; i < p.likes.length; i++){
                                            if(p.likes[i] === user_name){
                                               p.likes.splice(i, 1)
                                            }
                                        }
                                        liked_post.push(p)
   
                                        await User.update({ posts: targeted_posts }, { where: { userName:userName.trim() } });
   
                                        return res.status(200).json({
                                            message: `UN-LIKED 👎 👎`,
                                            data: liked_post
                                        })
                                   }
                                }
                            }
                        }  
                    })
                }else{
                    return res.status(400).json({
                        message: `User Details NOT FOUND`
                    })
                }
            }else{
                return res.status(500).json({
                    message: `Token VERIFICATON FAILED`
                })
            }
        }else{
            return res.status(400).json({
                message: `TOKEN NEEDED FOR AUTHORIZATION`
            })
        }


    }catch(error){
        console.error("Error liking a post:", error);
        return res.status(500).json({ error: "Internal server error - Error liking a post" });   
    }
}


/* -----------------------------------EDIT A POST----------------------------------------*/
export const edit_post = async(req:Request, res:Response) => {
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
                       const user_name = user_validation.userName

                       const { title, article } = req.body

                       const user_posts = user_validation.posts

                       if (user_posts.length === 0){
                        return res.status(200).json({
                            message: `${user_name} does not have any POSTS published.`
                        })
                       }else{
                            const target_post = user_posts.filter((post:any) => post.title === title.trim())

                            if(target_post.length === 0){
                                return res.status(200).json({
                                    message: `You don't have a post titled - ${title}`
                                })
                            }else{
                                target_post[0].article = article.trim()

                                await User.update({posts:user_posts}, { where: { userName: user_name}})

                                return res.status(200).json({
                                    message: ` 💚 ${target_post[0].title} has been UPDATED SUCCESSFULLY`,
                                    data: target_post
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
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error - Error creating post" });  
    }
}

/* -----------------------------------DELETE A POST----------------------------------------*/

export const delete_post = async(req:Request, res:Response) => {
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

                        const user_name = user_validation.userName

                        const { title } = req.body
 
                        const user_posts = user_validation.posts
 
                        if (user_posts.length === 0){
                         return res.status(200).json({
                             message: `${user_name} does not have any POSTS published.`
                         })
                        }else{
                             const target_post = user_posts.filter((post:any) => post.title === title.trim())
 
                             if(target_post.length === 0){
                                 return res.status(200).json({
                                     message: `You don't have a post titled - ${title}`
                                 })
                             }else{

                               const deleted_post = user_posts.indexOf(target_post[0])
                               user_posts.splice(deleted_post, 1)
 
                                 await User.update({posts:user_posts}, { where: { userName: user_name}})
 
                                 return res.status(200).json({
                                     message: `🚫 ${target_post[0].title} has been DELETED SUCCESSFULLY`
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
        console.error("Error creating post:", error);
        return res.status(500).json({ error: "Internal server error - Error creating post" });  
    }
}




















