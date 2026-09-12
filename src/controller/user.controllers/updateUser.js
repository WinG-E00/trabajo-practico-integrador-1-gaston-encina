import User from '../../models/user.model.js'


export const updateUser = async (req, res) => {

    try{

        // Desestructuracion de los parametros de body
        const { username, email , password, role  } = req.body;


        const usuarioEncontrado = await User.find










    }catch(err){

    }


};