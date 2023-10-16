import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express'
import sporranSession from './routes/sporran/sporranSession.js'
import sporranRequestAttestation from './routes/sporran/sporranRequestAttestation.js'
import sporranTerms from './routes/sporran/sporranTerms.js'
import cors from 'cors'
import Logging from './libraries/Logging.js'

import userRouter from './routes/user.route.js'
import credentialsRouter from './routes/credential.route.js'
import propertyRouter from './routes/property.route.js'
import collectionRouter from './routes/collection.route.js'
import loanRouter from './routes/loan.route.js'
import companyRouter from './routes/company.route.js'

dotenv.config()

mongoose
  //.connect("mongodb://localhost/XCAVProperty")
  .connect(
    process.env.MONGO_DB_URL
  )
  .then(() => {
    console.log("Successfuly connected to  DB...")
  })
  .catch((err) => console.log("Could not connect to db", err.message))

const app = express()

app.use((req, res, next) => {
  /** Log the Request */
  Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`)

  res.on('finish', () => {
    /** Log the Response */
    Logging.info(`Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`)
  })

  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

/** Rules of our API */
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)
app.options(
  '*',
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  }),
)

app.use("/api/session", sporranSession)
app.use("/api/request-attestation", sporranRequestAttestation)
app.use("/api/terms", sporranTerms)
app.use("/api/user", userRouter)
app.use("/api/credentials", credentialsRouter)
app.use("/api/property", propertyRouter)
app.use("/api/collection", collectionRouter)
app.use("/api/loan", loanRouter)
app.use("/api/company", companyRouter)

/** Healthcheck */
app.get('/foot', (req, res, next) => res.status(200).json({ message: 'ball' }))

const port = process.env.PORT || 3005
app.listen(port, () => {
  console.log(`listening to port ${port}...`)
})
