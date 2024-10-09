import request from '@/utils/request'
// 获取楼宇列表
export function getBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'GET',
    data
  })
}
