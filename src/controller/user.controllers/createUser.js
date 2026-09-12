import User from '../../models/user.model.js';

import { hashPassword } from '../../helpers/bcrypt.helper.js';


export const createUser = async (req, res) => {

    try {

        const { username, email, password, role } = req.body;

        const hashedPassword = await hashPassword(password);


        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        })

        return  res.status(201).json({ message: "usuario creado con extio" })

    }
    catch(error){

        return res.status(500).json({ message: "No se pudo crear el usuario", error })

    }

}