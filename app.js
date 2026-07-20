import 'dotenv/config'
import express from 'express'
import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'
import authRouter from './routes/auth.js'
import jobsRouter from './routes/jobs.js'
import connectDB from './db/connect.js'
import authenticateUser from './middleware/authentication.js'
import helmet from 'helmet'
import cors from 'cors'
import xss from 'xss-clean'
import rateLimiter from 'express-rate-limit'

const app = express();

// extra packages
app.set('trust proxy', 1)
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100
}))
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.json());

app.get('/', (req, res) => {
  res.send('jobs api');
})
// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter) // we protect jobs route by adding auth middleware

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
