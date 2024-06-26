<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="pageQuery.typeId" placeholder="分类" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.typeName" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload" @click="handleUpload">
        上传图片/音频
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-refresh" @click="handleCache">
        清空缓存
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
        
        <el-table-column label="ID" prop="id" width="70"/>
    
        <el-table-column label="名称" width="200">
            <template slot-scope="{row}">
                <span> {{ row.voiceName }}  </span>
                <el-tag v-for="item in row.types" :key="item.id"> {{ item.typeName }} </el-tag>
            </template>
        </el-table-column>
        
        <el-table-column label="状态" class-name="status-col" align="center" width="80">
            <template slot-scope="{row}">
                <el-switch
                v-model = row.status
                :active-value=1
                :inactive-value=0
                active-color="#13ce66"
                inactive-color="#909399"
                @change="changeStatus(row)"  >
                </el-switch>
            </template>
        </el-table-column>

        <el-table-column label="封面" width="120"  align="center">
            <template slot-scope="{row}">
                <el-popover placement="top-start" title="" trigger="hover">
                    <img :src="row.picture" alt="" style="width: 180px;height: 180px">
                    <img slot="reference" :src="row.picture" style="width: 80px;height: 80px">
                </el-popover>
            </template>
        </el-table-column>

        <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
            <span>{{ row.gmtCreate}}</span>
        </template>
        </el-table-column>
        
        <el-table-column label="更新时间" align="center">
        <template slot-scope="{row}">
            <span>{{ row.gmtModified}}</span>
        </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
            </el-button>
            <el-button type="warning" size="mini" @click="handleMain(row)" :disabled="row.playUrl === ''">
              详情
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
            </el-button>
        </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="名称" prop="voiceName">
            <el-input v-model="temp.voiceName" />
          </el-form-item>
          <el-form-item label="封面" prop="picture">
            <el-input v-model="temp.picture" />
          </el-form-item>
          <el-form-item label="音频" prop="playUrl">
            <el-input v-model="temp.playUrl" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
        </div>
      </el-dialog>

      
      <el-dialog :title="audio.name" :visible.sync="dialogAudioVisible" width="20%" destroy-on-close="true">
        <audio controls ref="audio">
          <source :src="audio.url" />
        </audio>
      </el-dialog>

      <el-dialog title="文件上传" :visible.sync="dialogUploaderVisible" width="35%" destroy-on-close="true">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          :on-change="chunkUpload"
          :limit="1">
          <el-button size="small" type="primary">点击上传</el-button>
          <template v-if="uploadFilePath === ''">    
            <div slot="tip" class="el-upload__tip">只能上传jpg/png/mp3文件</div>
          </template>
          <template v-if="uploadFilePath != ''">    
            <div slot="tip" class="el-upload__tip" style="color: red;">上传地址: {{ uploadFilePath }}</div>
          </template>
        </el-upload>
        <el-progress :percentage="uploadPercent" :color="customColors"></el-progress>
      </el-dialog>
  </div>
</template>

<script>
import typeAPI from '@/api/system/type/type'
import voiceAPI from '@/api/system/voice/voice'
import fileChunkAPI from '@/api/system/fileChunk/fileChunk'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getFileMd5 } from '../../utils/md5Util'


export default {
  directives: { waves },
  components: { Pagination },
  filters: {
    typeFilter(type) {
      const typeMap = {
        '冥想': 'success'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      pageQuery: {
        page: 1,
        size: 10,
        sort: undefined,
        typeId: undefined
      },
      calendarTypeOptions: [],
      list:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        voiceTag: '',
        voiceName: '',
        voiceMain: '',
        picture: '',
        playUrl: ''
      },
      total: 1,
      audio: {
        name: '',
        url: ''
      },
      uploadPercent: 0,
      uploadFileId: 0,
      uploadFilePath: '',
      dialogAudioVisible: false,
      dialogUploaderVisible: false
    }
  },
  created() {
    this.getList()
    this.loadTypes()
  },
  methods: {
    // 加载所有音频类型
    loadTypes() {
        typeAPI.getlistWithIsVoice('true').then(response => {
            this.calendarTypeOptions = response.data
            console.log(this.calendarTypeOptions)
        })
    },
    handleFilter() {
      this.pageQuery.page = 1
      this.getList()
    },
    getList() { 
      this.listLoading = true
      voiceAPI.getPageList(this.pageQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.totalAmount
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        voiceTag: '',
        voiceName: '',
        voiceMain: '',
        picture: '',
        playUrl: ''
      }
    },
    changeStatus(item) {
      this.listLoading = true
      voiceAPI.updateStatus(item).then(response => {
        item.status = response.data
      })
      this.listLoading = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.listLoading = true
      voiceAPI.save(this.temp).then(response => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: 'Success',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleMain(row) {
      this.audio.name = row.voiceName;
      this.audio.url = row.playUrl;
      this.dialogAudioVisible = true
    },
    handleUpdate(row) {
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    updateData() {
      this.listLoading = true
      voiceAPI.update(this.temp).then(response => {
        this.dialogFormVisible = false
        this.getList()
        this.$notify({
          title: 'Success',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      console.log(row.id)
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        voiceAPI.remove(row.id).then(response => { 
          this.getList()
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    }
    ,handleCache() {
        this.$confirm('是否清空当前模块缓存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          voiceAPI.cleanCache().then(response => { 
            this.$notify({
              title: 'Success',
              message: '清空成功',
              type: 'success',
              duration: 2000
            })
          })
        })
      }
    ,handleUpload() {
      this.dialogUploaderVisible = true
    },
    // 文件上传主要函数
    chunkUpload(uploadFile, uploadFiles) {
      // 重置进度条
      this.uploadPercent = 0
      // ==========进行切片
      // 文件信息
      let fileRaw = uploadFile.raw
      console.log(fileRaw)
      getFileMd5(fileRaw).then(res => {
        let fileMd5 = res
        // 分片数量为 8 可调整
        const chunkNum = 8
        let chunkSize = parseInt(fileRaw.size / chunkNum)
        // 文件分片储存
        let chunkList = []
        // 封装请求
        for (let i = 0; i < chunkNum; i++) {
          let formData = new FormData()
          formData.append('name', fileRaw.name)
          formData.append('md5', fileMd5)
          formData.append('start', i * chunkSize)
          formData.append('size', chunkSize)
          formData.append('chunks', chunkNum)
          formData.append('chunk', i)
          if (i != chunkNum - 1) {
            formData.append('file', fileRaw.slice(i * chunkSize, (i + 1) * chunkSize))
          } else {
            formData.append('file', fileRaw.slice(i * chunkSize))
          }
          chunkList.push(formData)
        }
        console.log(chunkList, 'chunkList----->>>')
        let fileId = 0
        // ==========正式上传
        const uploadPromises = chunkList.map(formData => {
          return fileChunkAPI.uploadFile(formData).then(res => {
            console.log("upload success chunk = " + formData.get('chunk'))
            this.uploadPercent += (100 / 8)
            fileId = res.data
          })
        })

        // 使用 Promise.all() 等待所有文件块上传完成
        Promise.all(uploadPromises)
          .then(() => {
            // 所有文件块上传完成后执行验证
            fileChunkAPI.verifyFile(fileId).then(res => {
              if (res.data.status === 1) {
                console.log('success===========')
                // 调用后端保存文件接口上传到云端
                fileChunkAPI.uploadFileToOSS(fileId).then(res => {
                  console.log(res.data)
                  this.uploadFilePath = res.data
                })
              }
            })
          })
          .catch(error => {
            // 处理错误
            console.error('Error uploading chunks:', error)
          })
      })
    }

  }
}
</script>