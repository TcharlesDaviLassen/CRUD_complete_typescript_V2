import { Request, Response } from 'express';

import { User } from '../models/User';

class UserController {
    public async createUser(req: Request, res: Response) {
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
            
            res.status(201).json({ message: 'Usuário registrado com sucesso', token: hashedPassword });
        } catch (error) {
            console.error('Erro durante o registro:', error);
            res.status(500).json({ message: 'Erro durante o registro' });
        }
    }
}

export default new UserController();
