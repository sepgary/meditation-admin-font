import request from '@/utils/request'

const api_name = '/user'

export default {

  getPageList(searchObj) {
    return request({
      url: `${api_name}/list`,
      method: 'get',
      params: searchObj
    })
  },

  getEventPageList(searchObj) {
    return request({
      url: `${api_name}/event/list`,
      method: 'get',
      params: searchObj
    })
  }
}