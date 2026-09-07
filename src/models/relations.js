import User from "./user.model.js";
import Profile from "./profile.model.js";
import Article from "./article.model.js";
import ArticleTag from "./articleTag.model.js";
import Tag from "./tag.model.js"

//Relacion de uno a uno con profile
// User tiene un profile
User.hasOne(Profile, {
  foreignKey: 'userId',
  as: 'profile'
})

Profile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
})







//relacion de muchos
User.hasMany(Article, {
  foreignKey: 'userId',
  as: 'article',
  onDelete: 'CASCADE',
  hooks: true
})

Article.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
})




//relacion de muchos a muchos
Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: 'articleId',
  otherKey: 'tagId',
  as: 'tags',
});

Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: 'tagId',
  otherKey: 'articleId',
  as: 'articles',
});
