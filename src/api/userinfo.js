import AV from '@/api/AV'

const userinfo = {}

// 查找用户信息
userinfo.findUser = () => {
  const query = new AV.Query('Userinfo')
  query.equalTo('email', '2564465541@qq.com')
  return query.first()
}

export default userinfo
