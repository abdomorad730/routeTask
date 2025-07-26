import dotenv from 'dotenv';
import path from 'path';
import express from 'express';

import bootstrap from './src/app.cotroller.js'; 
import compression from 'compression';

dotenv.config({ path: path.resolve('./Config/.env') });

const app = express();

const PORT = process.env.PORT || 5000;
app.use(compression())

bootstrap(app, express)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
  });
