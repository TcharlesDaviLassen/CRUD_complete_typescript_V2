import { User } from "../models/User";


(async () => {

    // await User.sync({ force: true });

    const dados = (
        {
            "name": "TCHARLES",
            // "age": 26,
            // "sex": "M",
            "email": "tdl@tdl.com",
            "password": "123",
            "createdAt": new Date(),
            "updatedAt": new Date(),
        }
    );

    // await User.create(dados);
    
    // const users = await User.findAll();
    // console.log(users);

})();