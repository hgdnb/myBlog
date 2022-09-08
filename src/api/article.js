import AV from '@/api/AV'

const article = {}

// 查找文章列表
article.findArticle = (page, catalog_id, tag) => {
  const query = new AV.Query('Article')
  if (catalog_id) {
    query.equalTo('catalog_id', catalog_id)
  }
  if (tag) {
    query.containsAll('tags', tag)
  }
  query.limit(10)
  query.skip(10 * (page - 1))
  return query.find()
}

// 查找文章列表
article.findArticleCount = (catalog_id, tag) => {
  const query = new AV.Query('Article')
  if (catalog_id) {
    query.equalTo('catalog_id', catalog_id)
  }
  if (tag) {
    query.containsAll('tags', tag)
  }
  return query.count()
}

// 查找相关推荐
article.findArticleOther = (id, catalog_id) => {
  const query = new AV.Query('Article')
  query.notEqualTo('objectId', id)
  query.equalTo('catalog_id', catalog_id)
  query.limit(10)
  return query.find()
}

// 搜索文章
article.searchArticle = (tags) => {
  const query = new AV.Query('Article')
  query.containedIn('tags', tags)
  query.limit(10)
  return query.find()
}

// 查找文章
article.findArticleDetail = (id) => {
  const query = new AV.Query('Article')
  query.equalTo('objectId', id)
  return query.first()
}
export default article
