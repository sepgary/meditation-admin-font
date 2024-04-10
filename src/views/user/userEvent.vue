<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="pageQuery.userId" placeholder="用户ID" style="width: 130px"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
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
      <el-table-column label="用户ID" prop="userId" width="70"/>
      <el-table-column label="HashId" prop="hashId" width="150"/>

      <el-table-column label="关键字" prop="ekey" width="170"/>
      <el-table-column label="其他" prop="extra" width="150" :show-overflow-tooltip='true'/>
  
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
      </el-table>
      
      <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />
    </div>
  </template>
  
  <script>
  import userAPI from '@/api/system/user/user'
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
          sort: undefined,
          userId: undefined
        },
        list:null,
        listLoading: false,
        total: 0,
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        userAPI.getEventPageList(this.pageQuery).then(response => {
            console.log(response)
          this.list = response.data.items
          this.total = response.data.totalAmount
          this.listLoading = false
        })
      },
      handleFilter() {
        this.pageQuery.page = 1
        this.getList()
      },
    //   changeStatus(item) {
    //     console.log(item.id)
    //     this.listLoading = true
    //     typeAPI.updateStatus(item).then(response => {
    //       item.status = response.data
    //     })
    //     this.listLoading = false
    //   },
    //   resetTemp() {
    //     this.temp = {
    //       id: undefined,
    //       voice: 0,
    //       typeName: '',
    //       orderNum: 1
    //     }
    //   },
    //   handleCreate() {
    //     this.resetTemp()
    //     this.dialogStatus = 'create'
    //     this.dialogFormVisible = true
    //   },
    //   createData() {
    //     this.listLoading = true
    //     typeAPI.save(this.temp).then(response => {
    //       this.dialogFormVisible = false
    //       this.getList()
    //       this.$notify({
    //         title: 'Success',
    //         message: '添加成功',
    //         type: 'success',
    //         duration: 2000
    //       })
    //     })
    //   },
    //   handleUpdate(row) {
    //     this.temp = Object.assign({}, row) // copy obj
    //     console.log(this.temp)
    //     this.dialogStatus = 'update'
    //     this.dialogFormVisible = true
    //   },
    //   updateData() {
    //     this.listLoading = true
    //     typeAPI.update(this.temp).then(response => {
    //       this.dialogFormVisible = false
    //       this.getList()
    //       this.$notify({
    //         title: 'Success',
    //         message: '修改成功',
    //         type: 'success',
    //         duration: 2000
    //       })
    //     })
    //   },
    //   handleDelete(row) {
    //     console.log(row.id)
    //     this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       typeAPI.remove(row.id).then(response => { 
    //         this.getList()
    //         this.$notify({
    //           title: 'Success',
    //           message: '删除成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     })
    //   }
    }
  }
  </script>