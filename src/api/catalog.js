import AV from '@/api/AV'

const catalog = {}

// 查找目录信息
catalog.findCatalog = () => {
  const query = new AV.Query('Catalog')
  return query.find()
}

export default catalog
