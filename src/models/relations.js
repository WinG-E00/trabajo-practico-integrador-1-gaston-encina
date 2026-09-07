import User from "./user.model";
import Profile from "./profile.model";
import Article from "./article.model";
import ArticleTag from "./articleTag.model";

//Relacion de uno a uno con profile
// User tiene un profile 
User.hasOne(Profile, {
  foreignKey: 'user_id',
  as: 'profile'
})

Profile.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
})







//relacion de muchos 
User.hasMany(Article, {
  foreignKey: 'article_id',
  as: 'article',
  onDelete: 'CASCADE',
  hooks: true
})

Article.belongsTo(User, {
  foreignKey: 'article_id',
  as: 'author'
})




//relacion de muchos a muchos
Article.belongsToMany(Tag, {
  through: ArticleTag,
  foreignKey: 'article_id',
  otherKey: 'tag_id',
  as: 'tags',
});

Tag.belongsToMany(Article, {
  through: ArticleTag,
  foreignKey: 'tag_id',
  otherKey: 'article_id',
  as: 'articles',
});








