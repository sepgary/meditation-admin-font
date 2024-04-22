import request from '@/utils/request'

const api_name = '/file'

export default {
    uploadFile(item) {
        return request({
            url: `${api_name}/upload`,
            method: 'post',
            data: item
        })
    },
    verifyFile(fileId) {
        return request({
            url: `${api_name}/verify/${fileId}`,
            method: 'get'
        })
    },
    uploadFileToOSS(fileId) {
        return request({
            url: `${api_name}/upload/${fileId}`,
            method: 'get'
        })
    }
}
