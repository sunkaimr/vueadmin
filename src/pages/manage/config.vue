<template>
  <imp-panel>
    <span class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="8" style="display: flex; align-items: flex-end;">
        </el-col>
        <el-col :span="16" style="display: flex; align-items: flex-end;">
          <div style="display: flex; margin-top: 15px; margin-left: auto;">
            <el-button size="mini" @click="loadData()">取 消</el-button>
            <el-button size="mini" type="primary" @click="onSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">保 存</el-button>
          </div>
        </el-col>
      </el-row>
    </span>
    <div slot="body" style="min-height: 500px;">
      <el-tabs v-model="tablePaneName" type="card" @tab-click="handleTablePaneChane" style="min-height: 500px;">
        <el-tab-pane label="源端配置" name="source">
          <el-form size="mini" :model="form" style="width: 70%;" ref="form">
            <el-form-item label="源端库用户名" prop="src_db_user" label-width="150px">
              <el-input v-model="form.src_db_user" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="源端库密码" label-width="150px">
              <el-input v-model="form.src_db_passwd" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item  label="库黑名单"  label-width="150px">
              <el-input type="textarea" :rows="2" v-model="form.src_exclude_database" clearable
                        placeholder="列入黑名单的库名（如sys,mysql等系统库）对用户不可见，多个库用英文逗号分割"/>
            </el-form-item>
            <el-form-item  label="表黑名单"  label-width="150px">
              <el-input type="textarea" :rows="2" v-model="form.src_exclude_tables" clearable
                        placeholder="列入黑名单的表名对用户不可见，多个表用英文逗号分割"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务配置" name="task">
          <el-form size="mini" :model="form" ref="form">
            <el-form-item label="任务最大并发数" prop="src_db_user" label-width="150px">
              <el-input-number prop="task_max_parallel" v-model="form.task_max_parallel" :min="1" />
            </el-form-item>
            <el-form-item label="任务超时时间(秒)" label-width="150px">
              <el-input-number prop="task_timeout" v-model="form.task_timeout" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他设置" name="other">
          <el-form size="mini" :model="form" ref="form">
            <el-form-item label="监控地址" prop="src_db_user" label-width="150px">
              <el-input v-model="form.thanos_url" autocomplete="off" clearable/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </imp-panel>
</template>

<script>
  import panel from "../../components/panel.vue"
  import * as sysApi from '../../services/sys'
  import * as api from "../../api";

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        fullscreenLoading: false,
        tablePaneName: "source",
        form :{
          src_db_user: "",
          src_db_passwd: "",
          src_exclude_database: "",
          src_exclude_tables: "",
          thanos_url: "",
          task_max_parallel: 0,
          task_timeout: 3600,
        },
      }
    },
    methods: {
      handleTablePaneChane(){
        this.loadData();
      },
      onSubmit(formName){
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 30000);

        this.$http.put(api.SYS_CONFIG, JSON.stringify(this.form)).then(res => {
          this.fullscreenLoading = false;
          this.$refs[formName].resetFields();
          this.$notify({ title: '成功', message: "保存成功", type: 'success' });
          this.loadData();
        }).catch(()=>{
          this.fullscreenLoading = false;
        })
      },


      loadData(){
        sysApi.getConfig().then(res => {
          this.form = res.data
        });
      }
    },
    created(){
      this.loadData();
    }
  }
</script>
<style>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  width: 120px;
}

.el-pagination {
  float: right;
  margin-top: 15px;
}

.el-table .cell-ellipsis {
  display: inline-block;
  width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-expand .el-form-item {
  margin-right: 40px;
  margin-left: 40px;
  margin-bottom: 0;
  width: 45%;
}
.table-expand, .table-expand * {
  font-size: 12px;
  margin-right: 20px;
  margin-left: 20px;
}

.el-checkbox__label {
  font-size: 12px;
}

.el-form-item__label{
  min-width: 80px;
}

.table-expand .el-form-item__label {
  text-align: right;
  font-size: 12px;
  padding-right: 0;
  width: auto;
  min-width: 80px;
  font-weight: bolder;
}

.table-expand .el-form--label-left .el-form-item__label {
  text-align: right;
  min-width: 100px;
}

.word-wrap {
  word-break: break-all;
}
</style>
