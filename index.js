import dotenv from 'dotenv'
import  mongoose from 'mongoose'
import express from 'express'
import sporranSession from './routes/sporranSession.js'

dotenv.config()

mongoose
  //.connect("mongodb://localhost/XCAVProperty")
  .connect(
    process.env.MONGO_DB_URL
  )
  .then(() => {
    console.log("Successfuly connected to  DB...");
  })
  .catch((err) => console.log("Could not connect to db", err.message));

const app = express();

app.use("/api/session", sporranSession);

/** Healthcheck */
app.get('/foot', (req, res, next) => res.status(200).json({ message: 'ball' }))

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});
