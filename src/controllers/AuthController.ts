import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { jwtSecret } from '../config/jwt';

class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { name, password } = req.body;
            console.log(req.body.name + ' ' + password)

            // Verifique se o usuário existe
            const user = await User.findOne({ where: { name } });
            if (!user) {
                res.status(401).json({ message: 'Credenciais inválidas' });
                return;
            }

            // Verifique a senha
            const passwordMatch = await User.comparePassword(password, user!.password);
            console.log("pass => ", user!.password);
            console.log("password => ", password);

            if (!passwordMatch) {
                res.status(401).json({ message: 'Credenciais inválidas' });
                return;
            }

            // Gere um token JWT válido
            const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
            console.log("token com duração de  => ", { expiresIn: '1h' }, + " " + token);

            res.status(200).json({ token });
        } catch (error) {
            console.error('Erro durante o login:', error);
            res.status(500).json({ message: 'Erro durante o login' });
        }
    }
}

export default new AuthController();
