import AV from '@/api/AV'

const project = {}

// 查找项目列表
project.findProject = (page) => {
  const query = new AV.Query('Project')
  query.limit(9)
  query.skip(9 * (page - 1))
  return query.find()
}

// 查找项目详情
project.findProjectDetail = (id) => {
  const query = new AV.Query('Project')
  query.equalTo('objectId', id)
  return query.first()
}

// 查找相关推荐
project.findProjectOther = (id, tags) => {
  const query = new AV.Query('Project')
  query.notEqualTo('objectId', id)
  query.containedIn('tags', tags)
  query.limit(10)
  return query.find()
}

// 查找项目数量
project.findProjectCount = () => {
  const query = new AV.Query('Project')
  return query.count()
}
export default project
