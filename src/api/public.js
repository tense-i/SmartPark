// 公共API
import request from '@/utils/request'
// 上传
export function uploadAPI(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
