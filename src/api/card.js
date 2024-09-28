import request from '@/utils/request'

// 获取卡片列表
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params
  })
}

// 创建月卡
export function createCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data
  })
}

export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`,
    method: 'GET'
  })
}

export function updateCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}

export function deleteCardAPI(ids) {
  return request({
    url: `/parking/card/${ids}`,
    method: 'DELETE'
  })
}
