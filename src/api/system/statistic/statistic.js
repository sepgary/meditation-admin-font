import request from '@/utils/request'

const api_name = '/user'

export default {

  getPageList(searchObj) {
    return request({
      url: `${api_name}/statistic`,
      method: 'get',
      params: searchObj
    })
  },
}