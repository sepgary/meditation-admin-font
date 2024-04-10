<template>
    <div class="components-container">
      <aside>[{{ course.courseName }}]</aside>
      <div class="editor-container">
        <dnd-list :list1="list1" :list2="list2" list1-title="课程下的音频" list2-title="可选音频" />
      </div>
      <el-row>
        <router-link :to="'/course/list'">
          <el-button type="info" size="mini">取消</el-button>
        </router-link>
        <el-button type="success" size="mini" @click="handleSave">保存</el-button>
      </el-row>
    </div>
</template>
  
<script>
import DndList from '@/components/DndList'
import courseVoiceAPI from '@/api/system/course/courseVoice'
import courseAPI from '@/api/system/course/course'
import voiceAPI from '@/api/system/voice/voice'
  
export default {
 name: 'DndListDemo',
    components: { DndList },
    data() {
      return {
        list1: [],
        list2: [],
        courseId: '',
        course: ''
      }
    },
    created() {
      this.courseId = this.$route.params && this.$route.params.id
      courseAPI.getById(this.courseId).then(response => {
        this.course = response.data
        this.getData()
      })
    },
    methods: {
      getData() {
        this.listLoading = true
        this.list1 = this.course.voices
        if (this.list1 == null) {
            this.list1 = []
        }
        voiceAPI.getListWithOutCourseId(this.courseId).then(response => {
          let list = response.data
          for (let i = 0; i < list.length; i ++) {
            this.list2.push(list[i])
          }
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
          courseVoiceAPI.save(this.courseId, dataIds).then(response => { 
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