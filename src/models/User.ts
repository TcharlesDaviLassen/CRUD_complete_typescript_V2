import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';
import bcrypt from 'bcrypt';

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;

    public static initialize() {
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
                modelName: 'UserV',
                tableName: 'usersV',
            }
        );
    }

    public static async hashPassword(password: string) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    public static async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }
}

User.initialize();

export { User };
