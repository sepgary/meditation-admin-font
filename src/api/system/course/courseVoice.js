import request from '@/utils/request'

const api_name = '/course/voice'

export default {

  save(courseId, voiceIds) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: {
        courseId: courseId,
        voiceIds: voiceIds
      }
    })
  }
}