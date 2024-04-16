import express from 'express';
import cors from 'cors';
import productsRouter from './routers/products.router';
import errorMiddleware from './middlewares/errorMiddleware';

const app = express();


app.use(express.json());
app.use(cors())

app.get('/', (_req, res) => {
  res.send({ message: 'server up' });
});

app.use('/products', productsRouter);

app.use(errorMiddleware);

export default app;