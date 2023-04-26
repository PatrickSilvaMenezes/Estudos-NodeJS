// todas configuraçoes do express

// importando express
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    mongoose.connect(
      'mongodb+srv://devhouse:devhouse@cluster0.u6gokft.mongodb.net/cluster0?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors()); // o cors permite liberar o acesso a api por qualquer dominio ou limitar para apenas 1 dominio
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'uploads'))
    );

    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

// exportando essa classe apenas o server
export default new App().server;
