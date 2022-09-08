import AV from 'leancloud-storage'

const APP_ID = 'Ddp3rNzt8sGz0wFjcL94n8gs-gzGzoHsz'
const APP_KEY = '715Xw4ttIZdbHtKLAZHTcchd'
const serverURL = 'https://ddp3rnzt.lc-cn-n1-shared.com'
AV.init({
  appId: APP_ID,
  appKey: APP_KEY,
  serverURL: serverURL
})

export default AV
