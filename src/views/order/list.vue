<template>
  <div class="app-container">
    <div class="filter-container">
      <el-col>
        <el-input v-model="pageQuery.outTradeNo" placeholder="订单号" style="width: 250px"/>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </el-col>
      <el-col :span="2">
        <div>
          <el-statistic group-separator="," :precision="2" :value="allTotalFee" title="￥总营收"></el-statistic>
        </div>
      </el-col>
      <el-col :span="2">
        <div>
          <el-statistic group-separator="," :precision="2" :value="totalFee" title="￥今日营收"></el-statistic>
        </div>
      </el-col>
      <el-col :span="2">
        <div>
          <el-statistic :value="count" title="今日订单数"></el-statistic>
        </div>
      </el-col>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
    
      <el-table-column label="订单流水号" align="center" prop="outTradeNo" width="220"/>
      <el-table-column label="用户ID" align="center" prop="userId" width="70"/>
      <el-table-column label="用户昵称" align="center" prop="userName" width="80"/>
      <el-table-column label="广告ID" align="center" prop="adId" width="70"/>
      <el-table-column label="广告来源" align="center" prop="adSource" width="80"/>
      <el-table-column label="订单状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.orderStatus | statusFilter">
            {{ row.orderStatus == 1 ? '待支付' : (row.orderStatus == 2 ?'已支付' : '已退款')}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="购买商品" align="center" prop="goodsName" width="80"/>
      <el-table-column label="总金额" align="center" prop="totalFee" width="100"/>
      <el-table-column label="支付类型" align="center" prop="payType" width="100"/>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.gmtCreate}}</span>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />
  </div>
</template>

<script>
import orderAPI from '@/api/system/order/order'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  directives: { waves },
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': '',
        '2': 'success',
        '3': 'info'
      }
      return statusMap[status]
    }
  },
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
      allTotalFee: 0,
      totalFee: 0,
      count: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      orderAPI.getPageList(this.pageQuery).then(response => {
        this.list = response.data.page.items
        this.total = response.data.page.totalAmount
        this.allTotalFee = response.data.allTotalFee
        this.totalFee = response.data.totalFee
        this.count = response.data.count
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