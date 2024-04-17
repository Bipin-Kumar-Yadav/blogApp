import { createBlogInput, updateBlogInput } from "@devxbipin/medium--common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRoutes = new Hono<{
    Bindings : {
        DATABASE_URL:string,
        JWT_SECRET: string,
    },
    Variables : {
        userId : string
    }
}>()

blogRoutes.use("/*", async (c,next)=>{
    try {
        const header = c.req.header('authorization') || "";
    
        const validateUser = await verify(header,c.env.JWT_SECRET)
        if(validateUser){
            c.set("userId",validateUser.id)
            await next();
        }
        else{
            c.status(403)
            return c.json({
                msg : "Unauthorized"
            })
        }
    } catch (error) {
        console.log(error)
        c.status(500)
        return c.json({
            msg : "Something went wrong"
        })
    }
})

blogRoutes.post('/blog',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
        const body = await c.req.json();
        
        const {success} = createBlogInput.safeParse(body)
        if(!success){
        c.status(411)
        return c.json({
          msg : "invalide input"
        })
      }

        const blog = await prisma.post.create({
            data : {
                title : body.title,
                content : body.content,
                authorId : c.get('userId')
            }
        })
    
        c.status(201)
        return c.json({
            msg : "new blog created",
            blog
        })
    } catch (error) {
        console.log(error)
        c.status(500)
        return c.json({
            msg : "Something went wrong while creating new blog"
        })
    }

}) 

blogRoutes.put('/blog',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const userId = c.get('userId');
        const body = await c.req.json();
        const {success} = updateBlogInput.safeParse(body)
        if(!success){
        c.status(411)
        return c.json({
          msg : "invalide input"
        })
      }

        const updatedBlog = await prisma.post.update({
            where : {
                id: body.id,
                authorId : userId,            
            },
            data : {
                title : body.title,
                content : body.content
            }
        })
    
        c.status(201)
        return c.json({
            msg : "blog updated successfully",
            updatedBlog
        })
    } catch (error) {
        console.log(error)
        c.status(500)
        return c.json({
            msg : "Something went wrong while updating blog"
        })
    }
        
})

blogRoutes.get('/blog/:id',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const blogId = c.req.param('id')

        const getBlog = await prisma.post.findUnique({
            where : {
                id : blogId,
            }
        })
    
        if(!getBlog){
            c.status(411)
            return c.json({
                msg : "blog does not exits"
            })
        }
         
        c.status(201)
        return c.json({
            getBlog
        })
    } catch (error) {
        console.log(error)
        c.status(500)
        return c.json({
            msg : "something went wrong while getting a single blog"
        })
    }
})

blogRoutes.get('/bulk',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    try {
        const allBlogs = await prisma.post.findMany({});
        if(!allBlogs) {
            c.status(411)
            return c.json({
                msg : "no blog found"
            })
        }
    
        c.status(201)
        return c.json({
            allBlogs
        })
    } catch (error) {
        console.log(error)
        c.status(500)
        return c.json({
            msg : "somthing went wrong while getting all blogs"
        })
    }

})