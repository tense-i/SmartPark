import request from '@/utils/request'

// 获取企业列表
/**
 * @description: 获取企业列表
 * @param {*} data {page,limit}
 * @return {*} promise
 */
export function getEnterpriseListAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    data
  })
}

// 更新企业
export function updateEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}

// 删除企业
export function deleteEnterpriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'

  })
}

// 根据名称查询企业
export function findEnterpriseByNameAPI(data) {
  getEnterpriseListAPI(data)
}

// 添加企业
export function addEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

// 获取行业列表
export function getIndustryListAPI() {
  return request({
    url: '/park/industry',
    method: 'GET'
  })
}

// 上传营业执照
export function uploadBusinessLicenseAPI(data) {
  return request({
    url: '/park/enterprise/uploadBusinessLicense',
    method: 'POST',
    data
  })
}

// 获取企业详情
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'GET'
  })
}

// 添加租赁合同
export function addRentContractAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

// 获取租赁合同列表
export function getRentContractListAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'GET',
    data
  })
}

// 根据id获取租赁合同
export function getRentContractByIdAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'GET'
  })
}

// 退租
export function rentOutByIdAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}
