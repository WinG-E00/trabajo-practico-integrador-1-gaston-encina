import sequelize from './database.js'
//Aca necesito importar los modelos para la funcion que hace el sync de la base de datos
import User from '../models/user.model.js';
import Tag from '../models/tag.model.js';
import Profile from '../models/profile.model.js';
import Article from '../models/article.model.js';
import ArticleTag from '../models/articleTag.model.js';
import '../models/relations.js'

export async function initModels() {

  try {

    await sequelize.authenticate();
    console.log('DB connected');

    //Sincronizacion de todos los modelos de la base de datos
    await sequelize.sync({ force: true }); //Force true para mi produccion.
    console.log('Modelos sincronizados');

  } catch (error) {
    console.log('Hubo un error al cargar los modelos y sincronizar la base de datos', error);

  }

}
