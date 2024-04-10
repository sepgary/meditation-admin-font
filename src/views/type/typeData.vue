<template>
    <div class="components-container">
      <aside>[{{ type.id }}] {{ type.typeName }}</aside>
      <div class="editor-container">
        <dnd-list :list1="list1" :list2="list2" list1-title="类型下的数据" list2-title="可选数据" />
      </div>
      <el-row>
        <router-link :to="'/type/list'">
          <el-button type="info" size="mini">取消</el-button>
        </router-link>
        <el-button type="success" size="mini" @click="handleSave">保存</el-button>
      </el-row>
    </div>
</template>
  
<script>
import DndList from '@/components/DndList'
import typeDataAPI from '@/api/system/type/typeData'
import typeAPI from '@/api/system/type/type'
  
export default {
 name: 'DndListDemo',
    components: { DndList },
    data() {
      return {
        list1: [],
        list2: [],
        typeId: '',
        type: ''
      }
    },
    created() {
      this.typeId = this.$route.params && this.$route.params.id
      typeAPI.getById(this.typeId).then(response => {
        this.type = response.data
      })
      this.getData()
    },
    methods: {
      getData() {
        this.listLoading = true
        typeDataAPI.getList(this.typeId).then(response => {
          let list = response.data
          console.log(list)
          for (let i = 0; i < list.length; i ++) {
            this.list1.push(list[i])
          }
          typeDataAPI.getListWithoutTypeId(this.typeId).then(response => {
            for (let i = 0; i < list.length; i ++) {
              list = response.data
              this.list2.push(list[i])
            }
          })
        })
      },
      handleSave() {
        this.$confirm('是否保存当前方案?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dataIds = []
          for (let i = 0; i < this.list1.length; i ++) {
            dataIds.push(this.list1[i].id)
          }
          typeDataAPI.save(this.typeId, dataIds).then(response => { 
            this.$notify({
              title: 'Success',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
            this.$router.go(-1);
          })
        })
      }
    }
  }
</script>