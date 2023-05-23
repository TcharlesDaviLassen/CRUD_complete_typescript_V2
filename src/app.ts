import express, { Application, Request, Response } from 'express';
import router from './routes';
// import sequelize from './config/database';

class App {
    
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        // this.database();
    }

    private config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    private routes() {
        this.app.use('/', router);
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ message: 'Endpoint não encontrado' });
        });
    }

    // private database() {
    //     sequelize
    //         .sync()
    //         .then(() => {
    //             console.log('Conexão com o banco de dados estabelecida com sucesso');
    //         })
    //         .catch((error) => {
    //             console.error('Erro durante a conexão com o banco de dados:', error);
    //         });
    // }
}

export default new App().app;
