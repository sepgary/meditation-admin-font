import request from '@/utils/request'

const api_name = '/type/data'

export default {

  getList(id) {
    return request({
      url: `${api_name}/list/${id}`,
      method: 'get'
    })
  },

  getListWithoutTypeId(id) {
    return request({
      url: `${api_name}/list/without/${id}`,
      method: 'get'
    })
  },

  save(typeId, dataIds) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: {
        typeId: typeId,
        dataIds: dataIds
      }
    })
  }
}