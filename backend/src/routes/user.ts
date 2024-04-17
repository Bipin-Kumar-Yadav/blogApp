import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@devxbipin/medium--common";


export const userRoutes = new Hono<{
    Bindings :{
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRoutes.post('/signup', async (c)=>{
    const prisma = new PrismaClient(
      {
        datasourceUrl : c.env.DATABASE_URL,
      }
    ).$extends(withAccelerate())
  
    try {
      const body = await c.req.json();
      const {success} = signupInput.safeParse(body)
      if(!success){
        c.status(411)
        return c.json({
          msg : "invalide input"
        })
      }

      if(!body || typeof body !== 'object'){
        return c.json({
          msg : "Invalid body"
        })
      }
  
      const validateUser = await prisma.user.findUnique({
        where : {
          email : body.email
        }
      })
  
      if(validateUser){
        return c.json({
          msg : "User exits"
        })
      }
  
      const user = await prisma.user.create({
        data : {
          email :  body.email,
          password : body.password,
          name : body.name,
        }
      })
      
      const token = await sign({id:user.id},c.env.JWT_SECRET);
    
      return c.json({
        jwt : token
      })
    } catch (error) {
      console.log(error)
      return c.json({
        msg : "Something went wrong"
      })
    }
  })


  userRoutes.post('/signin',async(c)=>{
    const prisma = new PrismaClient({
      datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const body = await c.req.json();
      
      const {success} = signinInput.safeParse(body)
      if(!success){
        c.status(411)
        return c.json({
          msg : "invalide input"
        })
      }
      
      if(!body){
        return c.json({
          msg : "Invalide body"
        })
      }
    
      const validateUser = await prisma.user.findUnique({
        where: {
          email : body.email
        }
      })
    
      if(!validateUser){
        return c.json({
          msg : "user not found"
        })
      }
      
      if(body.password != validateUser.password){
        return c.json({
          msg : "Invalide password"
        })
      }
    
      const token = await sign({id:validateUser.id}, c.env.JWT_SECRET)
      
      return c.json({
        msg : "logged In successfull",
        token : token
      })
    } catch (error) {
      console.log(error)
      return c.json({
        msg : "Something went wrong"
      })
    }
  })
  