<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="pageQuery.isVoice" placeholder="类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
  
    <el-table-column label="名称" width="170">
      <template slot-scope="{row}">
        <span> {{ row.typeName }}  </span>
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

    <el-table-column label="排序字段" align="center" width="100">
      <template slot-scope="{row}">
        {{ row.orderNum }}
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
        <router-link :to="'/type/typeData/'+row.id">
          <el-button type="warning" size="mini">
            详情
          </el-button>
        </router-link>
        <el-button size="mini" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </el-table-column>
    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称" prop="typeName">
          <el-input v-model="temp.typeName" />
        </el-form-item>
        <el-form-item label="类别" prop="voice">
          <el-switch
            v-model=temp.voice
            active-color="#409EFF"
            inactive-color="#67C23A"
            active-text="声音"
            inactive-text="冥想"/>
        </el-form-item>
        <el-form-item label="排序字段" prop="orderNum">
          <el-input-number v-model="temp.orderNum" :precision="2" :step="0.1" :max="1000"></el-input-number>
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
import typeAPI from '@/api/system/type/type'
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
        isVoice: undefined
      },
      list:null,
      listLoading: false,
      testValue: 1,
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        voice: 0,
        typeName: '',
        orderNum: 1
      },
      total: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      typeAPI.getPageList(this.pageQuery).then(response => {
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
      typeAPI.updateStatus(item).then(response => {
        item.status = response.data
      })
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        voice: 0,
        typeName: '',
        orderNum: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    createData() {
      this.listLoading = true
      typeAPI.save(this.temp).then(response => {
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
      typeAPI.update(this.temp).then(response => {
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
        typeAPI.remove(row.id).then(response => { 
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
          typeAPI.cleanCache().then(response => {
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