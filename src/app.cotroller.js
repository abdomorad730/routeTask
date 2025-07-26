import connection from "./DB/connect.js";
import noteRouter from "./modules/note/note.controller.js";
import userRouter from "./modules/user/user.controller.js";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./modules/graphQlSchema.js";
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests, please try again later." }
});

const bootstrap = async (app, express) => {
  try {
    app.use(cors());
    app.use(helmet());
    app.use(limiter);
    await connection();

    app.use(express.json());
    app.get('/', (req, res) => {
      res.send('Hello from Express on Vercel!');
    });

    app.use("/users", userRouter);

    app.use("/notes", noteRouter);
    app.use('/graphql', createHandler({ schema: schema }))

    app.use((req, res) => {
      res.status(404).json({ msg: `Invalid URL: ${req.originalUrl}` });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ msg: 'Something went wrong', error: err.message, stack: err.stack });
    });
  } catch (err) {
    console.log("Failed to bootstrap application:", err.message);
  }


}
export default bootstrap