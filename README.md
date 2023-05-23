### Exemplo completo de um backend RESTful API avançado em TypeScript, usando o framework Express, o ORM Sequelize e a criptografia Base64, seguindo o padrão MVC (Model-View-Controller):

Instale as dependências necessárias:
```shell
npm install express sequelize mysql2 bcrypt jsonwebtoken
```

### Crie a estrutura de pastas do projeto:

```markdown

- src
  - config
    - database.ts
    - jwt.ts
  - controllers
    - UserController.ts
    - AuthController.ts
  - models
    - User.ts
  - routes
    - index.ts
  - app.ts
```


### Configure o arquivo `src/config/database.ts` para conectar-se ao banco de dados e definir as configurações do Sequelize:

```typescript

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'mysql',
});

export default sequelize;
```


### Configure o arquivo `src/config/jwt.ts` para definir a chave secreta usada para assinar os tokens JWT:

```typescript
export const jwtSecret = 'chave-secreta-do-token';
```

### Crie o modelo de usuário `src/models/User.ts` usando o Sequelize:

```typescript

import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcrypt';

class User extends Model {

  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public static initialize(): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'User',
      }
    );
  }

  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

User.initialize();

export default User;
```

### Crie o controlador `src/controllers/UserController.ts` para lidar com as operações relacionadas aos usuários:

```typescript

import { Request, Response } from 'express';
import User from '../models/User';

class UserController {
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      // Verifique se o usuário já está registrado
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(409).json({ message: 'Usuário já registrado' });
        return;
      }

      // Criptografe a senha
      const hashedPassword = await User.hashPassword(password);

      // Crie um novo usuário
      await User.create({ name, email, password: hashedPassword });

      res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
      console.error('Erro durante o registro:', error);
      res.status(500).json({ message: 'Erro durante o registro' });
    }
  }
}

export default new UserController();
```

### Crie o controlador `src/controllers/AuthController.ts` para lidar com a autenticação do usuário:

```typescript
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt';

class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Verifique se o usuário existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Credenciais inválidas' });
        return;
      }

      // Verifique a senha
      const passwordMatch = await User.comparePassword(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ message: 'Credenciais inválidas' });
        return;
      }

      // Gere um token JWT válido
      const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

      res.status(200).json({ token });
    } catch (error) {
      console.error('Erro durante o login:', error);
      res.status(500).json({ message: 'Erro durante o login' });
    }
  }
}

export default new AuthController();
```

### Crie o arquivo `src/routes/index.ts` para definir as rotas da API:

```typescript
import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', UserController.createUser);
router.post('/login', AuthController.login);

router.get('/protected', authMiddleware, (req, res) => {
  // Rota protegida acessível apenas para usuários autenticados
  res.json({ message: 'Acesso autorizado' });
});

export default router;
```

### Crie o arquivo `src/app.ts` para iniciar o servidor Express e definir as configurações:

```typescript
import express, { Application, Request, Response } from 'express';
import router from './routes';
import sequelize from './config/database';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.database();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.app.use('/', router);
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ message: 'Endpoint não encontrado' });
    });
  }

  private database(): void {
    sequelize
      .sync()
      .then(() => {
        console.log('Conexão com o banco de dados estabelecida com sucesso');
      })
      .catch((error) => {
        console.error('Erro durante a conexão com o banco de dados:', error);
      });
  }
}

export default new App().app;
```

### Crie o arquivo `index.s` na raiz do projeto para iniciar o servidor:

```typescript
import app from './src/app';

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
```

### Execute o servidor:
```shell
npm start
```
Agora você tem um backend RESTful API avançado com todos os critérios de segurança, incluindo registro de usuário, autenticação com tokens JWT, criptografia de senha e rotas protegidas. Você pode enviar solicitações HTTP para as rotas /register e /login para criar um novo usuário e fazer login, respectivamente. A rota /protected está protegida e só pode ser acessada por usuários autenticados com um token JWT válido.