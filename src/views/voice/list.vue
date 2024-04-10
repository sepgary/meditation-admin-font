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


        <el-table-column label="标签" prop="num" align="center" width="200">
          <template slot-scope="{row}">
            <el-tag v-for="item in row.tags" :key="item"> {{ item }} </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="详情" prop="courseMain" width="200" :show-overflow-tooltip='true'/>

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
          <el-form-item label="标签" prop="voiceTag">
            <el-input v-model="temp.voiceTag" />
          </el-form-item>
          <el-form-item label="详情" prop="voiceMain">
            <el-input type="textarea" v-model="temp.voiceMain" />
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
  </div>
</template>

<script>
import typeAPI from '@/api/system/type/type'
import voiceAPI from '@/api/system/voice/voice'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      dialogAudioVisible: false
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
    ,
      handleCache() {
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
  }
}
</script>