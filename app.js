  //Importaciones
import express from 'express';
import 'dotenv/config';
  //Import funcion para sincronizar base de datos
import { initModels } from './src/config/database.sync.js'
  //import de el router principal
import router from './src/routes/router.js';


import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

//App
const app = express();

//configuracion del app
app.use(express.json())
app.use(cookieParser());

//Montar router
app.use('/api', router)


// endpoint de testeo del servidor de express
app.get('/test', (req, res) => {
  res.send('Ok')
})


async function initServer() {

  try {

    //sincronizar los modelos
    await initModels();

    //Iniciar servidor
    app.listen(PORT, () => {
      console.log(`El servidor se ha iniciado en el puerto ${PORT}`);3
    })

  }catch(err){

    console.error('Error al conetar con la base de datos', err)

  }

};

initServer()
