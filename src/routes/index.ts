import { Router } from 'express';

import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';
// import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', UserController.createUser);
router.post('/login', AuthController.login);

// router.get('/protected', authMiddleware, (req, res) => {
  // Rota protegida acessível apenas para usuários autenticados
//   res.json({ message: 'Acesso autorizado' });
// });

export default router;
