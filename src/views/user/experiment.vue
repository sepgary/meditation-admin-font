<template>
    <div class="app-container">
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          添加
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
      <el-table-column label="配置名称" prop="name" width="80"/>
      <el-table-column label="配置参数" prop="params" width="180"/>
      <el-table-column label="配置描述" prop="des" width="100"/>
      <el-table-column label="配置分组" prop="layer" width="80"/>
      <el-table-column label="平台" prop="platform" width="80"/>
      <el-table-column label="版本" prop="version" width="60"/>
      <el-table-column label="开始桶号" prop="startBucket" width="80"/>
      <el-table-column label="结束桶号" prop="endBucket" width="80"/>
      <el-table-column label="开始年龄" prop="startAge" width="80"/>
      <el-table-column label="结束年龄" prop="endAge" width="80"/>
      <el-table-column label="性别(1 男 2 女)" prop="sex" width="120"/>
  
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

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
            <el-form-item label="配置名称" prop="name">
              <el-input v-model="temp.name" />
            </el-form-item>
            <el-form-item label="配置参数" prop="params">
              <el-input type="textarea" v-model="temp.params" />
            </el-form-item>
            <el-form-item label="配置描述" prop="des">
            <el-input v-model="temp.des" />
            </el-form-item>
            <el-form-item label="配置分组" prop="layer">
              <el-input type="number" v-model="temp.layer" />
            </el-form-item>
            <el-form-item label="平台" prop="platform">
              <el-input v-model="temp.platform" />
            </el-form-item>
            <el-form-item label="版本" prop="version">
              <el-input v-model="temp.version" />
            </el-form-item>
            <el-form-item label="开始桶号" prop="startBucket">
              <el-input type="number" v-model="temp.startBucket" />
            </el-form-item>
            <el-form-item label="结束桶号" prop="endBucket">
              <el-input type="number" v-model="temp.endBucket" />
            </el-form-item>
            <el-form-item label="开始年龄" prop="startAge">
              <el-input type="number" v-model="temp.startAge" />
            </el-form-item>
            <el-form-item label="结束年龄" prop="endAge">
              <el-input type="number" v-model="temp.endAge" />
            </el-form-item>
            <el-form-item label="性别(1 男 2 女)" prop="sex">
              <el-input type="number" v-model="temp.sex" />
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
    </div>
  </template>
  
  <script>
  import experimentAPI from '@/api/system/experiment/experiment'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  
  export default {
    directives: { waves },
    components: { Pagination },
    data() {
      return {
        pageQuery: {
          page: 1,
          size: 10,
        },
        list:null,
        listLoading: false,
        total: 0,
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        temp: {
          id: undefined,
          name: '',
          params: '',
          des: '',
          layer: 1,
          platform: '',
          version: '',
          startBucket: 0,
          endBucket: 99,
          sex: 1,
          startAge: 0,
          endAge: 99
        },
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        experimentAPI.getPageList(this.pageQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.totalAmount
          this.listLoading = false
        })
      },
      handleFilter() {
        this.pageQuery.page = 1
        this.getList()
      },
      changeStatus(item) {
        console.log(item.id)
        this.listLoading = true
        experimentAPI.updateStatus(item).then(response => {
          item.status = response.data
        })
        this.listLoading = false
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          params: '',
          des: '',
          layer: 1,
          platform: '',
          version: '',
          startBucket: 1,
          endBucket: 99
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      createData() {
        this.listLoading = true
        experimentAPI.save(this.temp).then(response => {
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
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        console.log(this.temp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      updateData() {
        this.listLoading = true
        experimentAPI.update(this.temp).then(response => {
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
          experimentAPI.remove(row.id).then(response => { 
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
    }
  }
  </script>