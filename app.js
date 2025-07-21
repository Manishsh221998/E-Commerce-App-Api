const express=require('express')
const dotenv=require('dotenv')
const connectDB = require('./app/config/db')
const authRouter = require('./app/router/authRoutes')
const userRouter = require('./app/router/userRoutes')
const categoriesAndsubRouter = require('./app/router/categoriesAndsubRoutes')
const productRouter = require('./app/router/productRoutes')
const dashboardRouter = require('./app/router/dashboardRoutes')
  
const app=express()

dotenv.config()
connectDB()

app.use(express.json({limit:'50mb',extended:true}))

app.use("/uploads",express.static('uploads'))

app.use(dashboardRouter)
app.use('/api/auth',authRouter)
app.use('/api',userRouter)
app.use('/api',categoriesAndsubRouter)
app.use('/api',productRouter)
 

app.listen(process.env.PORT,()=>{console.log("Server is running on port :",process.env.PORT)})