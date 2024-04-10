import request from '@/utils/request'

const api_name = '/type'

export default {

  getPageList(searchObj) {
    return request({
      url: `${api_name}/list`,
      method: 'get',
      params: searchObj
    })
  },

  
  updateStatus(item) {
    return request({
      url: `${api_name}/update/status`,
      method: 'put',
      params: {
        id: item.id
      }
    })
  },

  save(item) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: item
    })
  },

  update(item) {
    return request({
      url: `${api_name}/update`,
      method: 'put',
      data: item
    })
  },

  remove(id) {
    return request({
      url: `${api_name}/remove`,
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  
  getlist() {
    return request({
      url: `${api_name}/list`,
      method: 'get'
    })
  },

  getById(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },

  cleanCache() {
    return request({
      url: `${api_name}/cache`,
      method: 'put'
    })
  }
}