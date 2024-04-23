<template>
    <div class="app-container">
  
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
      
      <el-table-column label="日期" prop="statisticDate" width="120"/>
      <el-table-column label="首页" prop="userEventStatistic.STATISTIC_INDEX" width="100"/>
      <el-table-column label="发现页" prop="userEventStatistic.STATISTIC_FOUND" width="100"/>
      <el-table-column label="搜索页" prop="userEventStatistic.STATISTIC_SEARCH" width="100"/>
      <el-table-column label="课程列表页" prop="userEventStatistic.STATISTIC_COURSE" width="100"/>
      <el-table-column label="音频列表页" prop="userEventStatistic.STATISTIC_VOICE" width="100"/>
      <el-table-column label="音频详情页" prop="userEventStatistic.STATISTIC_AUDIO" width="100"/>
      
      </el-table>
      
      <pagination v-show="total>0" :total="total" :page.sync="pageQuery.page" :limit.sync="pageQuery.size" @pagination="getList" />
    </div>
  </template>
  
  <script>
  import statisticAPI from '@/api/system/statistic/statistic'
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
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        statisticAPI.getPageList(this.pageQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.totalAmount
          this.listLoading = false
        })
      },
    }
  }
  </script>