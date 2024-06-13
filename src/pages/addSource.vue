<template>
  <imp-panel :title="form.id ? '编辑':'添加源端信息'">
    <el-form ref="form" :model="form" label-width="180px">
      <el-form-item label="源端名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="集群ID">
        <el-input v-model="form.cluster_id"></el-input>
      </el-form-item>
      <el-form-item label="集群名称">
        <el-input v-model="form.cluster_name"></el-input>
      </el-form-item>
      <el-form-item label="数据库">
        <el-input v-model="form.database_name"></el-input>
      </el-form-item>
      <el-form-item label="表">
        <el-input v-model="form.tables_name"></el-input>
      </el-form-item>
      <el-form-item label="列">
        <el-input v-model="form.columns"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">添加</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </imp-panel>
</template>
<script>
  import panel from "../components/panel.vue"
  import * as api from "../api"

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        form: {
          id: 0,
          name: '',
          description:'',
          cluster_id:'',
          cluster_name:'',
          database_name:'',
          tables_name:'',
          columns:'',
        }
      }
    },
    created(){
      this.loadData();
    },
    methods: {
      onCancel(){
        this.$router.push({path: 'source'})
      },
      onSubmit(){
        const data = JSON.stringify(this.form)
        this.$http.post(api.SOURCE_ADD, data,{
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.form = res.data;
            this.$confirm('添加成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({path: 'source'})
            })
          })
      },
      onEditSubmit(){
        this.$http.put(api.SOURCE_ADD, this.form)
          .then(res => {
            this.form = res.data;
            this.$confirm('修改成功, 是否返回列表?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.$router.push({path: 'source'})
            })
          })
      },
      loadData(){
        if (this.$route.query && this.$route.query != null && this.$route.query.id && this.$route.query.id != null) {
          this.form.id = this.$route.query.id;
          this.$http.get(api.SYS_USER_GET + "?id=" + this.form.id)
            .then(res => {
              this.form = res.data;
            })
        }
      }
    }
  }
</script>
