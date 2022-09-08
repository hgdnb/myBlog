import AV from '@/api/AV'

const diary = {}

// 查找日事列表
diary.findDiary = () => {
  const query = new AV.Query('Diary')
  query.descending('time');
  return query.find()
}
export default diary
