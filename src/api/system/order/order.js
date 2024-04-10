import request from '@/utils/request'

const api_name = '/order'

export default {

  getPageList(searchObj) {
    return request({
      url: `${api_name}/list`,
      method: 'get',
      params: searchObj
    })
  }
}