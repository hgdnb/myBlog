import AV from '@/api/AV'

const fileStorage = {}

// 上传文件
fileStorage.uploadFile = function(data) {
  const file = new AV.File(new Date().getTime.toString(), {base64: data});
  return file.save()
}

// 删除文件
fileStorage.deleteFile = function(id) {
  const file = AV.File.createWithoutData(id);
  return file.destroy();
}

export default fileStorage
