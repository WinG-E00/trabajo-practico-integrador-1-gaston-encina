import sequelize from './database.js';

//Aca necesito importar los modelos para la funcion que hace el sync de la base de datos



export async function initModels() {

  try {
    
    await sequelize.authenticate();
    console.log('DB connected');

    //Sincronizacion de todos los modelos de la base de datos
    await sequelize.sync({ force: true }); //Force true para mi produccion.
    console.log('Modelos sincronizados');

  } catch (error) {
    console.log('Hubo un error al iniciar la base de datos')
  }
  
}