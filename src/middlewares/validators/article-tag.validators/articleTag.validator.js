import Article from '../../../models/article.model.js';
import Tag from '../../../models/tag.model.js';
import { positiveIdBodyValidator } from '../resource.validator.js';
import { errorValidator } from '../../../helpers/errorValidator.helper.js';

export const articleTagValidator = [
  positiveIdBodyValidator('articleId', Article),
  positiveIdBodyValidator('tagId', Tag),
  errorValidator,
];
