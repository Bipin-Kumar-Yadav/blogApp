
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET : string,
  }
}>()

// middleware 
app.use('/api/v1/blog/*', async(c,next)=>{
  try {
    //get the header
    const header = c.req.header('authorization') || "";
    // verify the header
    const response = await verify(header,c.env.JWT_SECRET);
    if(response.id){
      return next();
    }
    else{
      c.status(403)
      return c.json({
        msg : "unauthorized"
      })
    }
  } catch (error) {
    console.log(error)
    c.status(500)
    return c.json({
      msg : "something went wrong"
    })
  }
})


app.get('/', async (c) => {
  
  return c.json({
    msg : "Welcome to the medium"
  })
})

app.post('/api/v1/user/signup', async (c)=>{
  const prisma = new PrismaClient(
    {
      datasourceUrl : c.env.DATABASE_URL,
    }
  ).$extends(withAccelerate())

  try {
    const body = await c.req.json();
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


app.post('/api/v1/user/signin',async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
  
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



app.post('/api/v1/blog', async(c)=>{
  const prisma = new PrismaClient({
    datasourceUrl : c.env.DATABASE_URL
  }).$extends(withAccelerate());


  const body = await c.req.json();


  return c.json({
    msg : "router for creating blog"
  })
})
app.put('/api/v1/blog',(c) =>{
  return c.json({
    msg : "router for updating blog"
  })
})
app.get('/api/v1/blog/:id',(c)=>{
  return c.json({
    msg : "router for getting a single blog"
  })
})
app.get('/api/v1/blog/bulk',(c)=>{
  return c.json({
    msg : "router for getting bulk of blogs"
  })
})


export default app
