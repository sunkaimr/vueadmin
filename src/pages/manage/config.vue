<template>
  <imp-panel>
    <div slot="body" style="min-height: 500px;">
      <el-tabs v-model="tablePaneName" @tab-click="handleTablePaneChane" style="min-height: 500px;">
        <el-tab-pane label="通知配置" name="notice">
          <el-form size="mini" :model="config" style="width: 70%;" ref="form">
            <el-form-item label="通知方式" label-width="150px">
              <el-select v-model="config.notice" placeholder="请选择">
                <el-option v-for="i in noticeOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="邮件服务器地址" prop="email_host"  label-width="150px">
              <el-input v-model="config.email_host" autocomplete="off" placeholder="请输入邮件服务器地址" clearable/>
            </el-form-item>
            <el-form-item label="邮件服务器端口" label-width="150px">
              <el-input-number prop="email_port" v-model="config.email_port" :controls="false" />
            </el-form-item>
            <el-form-item label="用户名" prop="email_username" label-width="150px">
              <el-input v-model="config.email_username" autocomplete="off" placeholder="请输入账户名称" clearable/>
            </el-form-item>
            <el-form-item label="密码" label-width="150px">
              <el-input v-model="config.email_password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="不校验服务端证书" prop="email_insecure_skip_verify" label-width="150px">
              <el-radio-group size="small" v-model="config.email_insecure_skip_verify">
                <el-radio :label="true" style="line-height: 30px">是</el-radio>
                <el-radio :label="false" style="line-height: 30px">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form size="mini"  style="width: 70%;">
            <el-form-item label="通知测试" label-width="150px">
              <el-input placeholder="请输入测试邮件地址" v-model="config.test_user" class="input-with-select">
                <el-button slot="append" @click="noticeTest(config.test_user)">发送</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="集群配置" name="cluster">
          <el-form size="mini" :model="config" style="width: 70%;" ref="form">
            <el-form-item label="源端库用户名" prop="cluster_default_user" label-width="150px">
              <el-input v-model="config.cluster_default_user" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item label="源端库密码" label-width="150px">
              <el-input v-model="config.cluster_default_passwd" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item label="库黑名单" label-width="150px">
              <el-input type="textarea" :rows="2" v-model="config.cluster_exclude_database" clearable
                        placeholder="列入黑名单的库名（如sys,mysql等系统库）对用户不可见，多个库用英文逗号分割"/>
            </el-form-item>
            <el-form-item label="表黑名单" label-width="150px">
              <el-input type="textarea" :rows="2" v-model="config.cluster_exclude_tables" clearable
                        placeholder="列入黑名单的表名对用户不可见，多个表用英文逗号分割"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务配置" name="task">
          <el-form size="mini" :model="config" ref="form">
            <el-form-item label="任务最大并发数" prop="task_max_parallel" label-width="150px">
              <el-input-number prop="task_max_parallel" v-model="config.task_max_parallel" :min="1" :controls="false" />
            </el-form-item>
            <el-form-item label="任务冲突级别" label-width="150px">
              <el-select v-model="config.task_conflict_level" placeholder="请选择">
                <el-option v-for="i in taskConflictLevelOption" :key="i.value" :label="i.name"
                           :value="i.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="允许任务冲突个数" label-width="150px">
              <el-input-number prop="task_conflict_max" v-model="config.task_conflict_max" :controls="false"/>
            </el-form-item>
            <el-form-item label="任务超时时间(秒)" label-width="150px">
              <el-input-number prop="task_timeout" v-model="config.task_timeout" :controls="false" />
            </el-form-item>
            <el-form-item label="工作流保留天数" label-width="150px">
              <el-input-number prop="workflow_retention_days" v-model="config.workflow_retention_days" :controls="false" />
            </el-form-item>
            <el-divider content-position="center">运行时状态监测</el-divider>
            <el-form-item label="源端状态检测" label-width="150px">
              <el-switch v-model="config.source_status_detect"></el-switch>
            </el-form-item>
            <el-form-item label="源端磁盘使用率" label-width="150px">
              <el-input-number prop="source_status_detect_disk_usage" v-model="config.source_status_detect_disk_usage" :controls="false" :min="0" :max="100" :disabled="!config.source_status_detect"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他设置" name="other">
          <el-form size="mini" :model="config" style="width: 70%;" ref="form">
            <el-form-item label="监控地址" prop="thanos_url" label-width="150px">
              <el-input v-model="config.thanos_url" autocomplete="off" clearable/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div style="display: flex;  justify-content: flex-end; margin: 15px 15px 15px auto;">
        <el-button size="mini" @click="loadData()">取 消</el-button>
        <el-button size="mini" type="primary" @click="onSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
      </div>
    </div>
  </imp-panel>
</template>

<script>
import panel from "../../components/panel.vue"
import * as sysApi from '../../services/sys'
import * as api from "../../api";
import {noticeOption, taskConflictLevelOption, Config} from '../../common/utils'

export default {
  components: {
    'imp-panel': panel
  },
  data() {
    return {
      noticeOption,
      taskConflictLevelOption,
      fullscreenLoading: false,
      tablePaneName: "notice",
      config: new Config(),
    }
  },
  methods: {
    handleTablePaneChane() {
      this.loadData();
    },
    onSubmit(formName) {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 30000);

      this.$http.put(api.SYS_CONFIG, JSON.stringify(this.config)).then(res => {
        this.fullscreenLoading = false;
        this.$refs[formName].resetFields();
        this.$notify({title: '成功', message: "保存成功", type: 'success'});
        this.loadData();
      }).catch(() => {
        this.fullscreenLoading = false;
      })
    },

    noticeTest(user) {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 30000);

      this.$http.get(api.SYS_CONFIG_NOTICE_TEST, {params:{user}}).then(res => {
        this.fullscreenLoading = false;
        this.$notify({title: '成功', message: res.data.message, type: 'success'});
      }).catch(() => {
        this.fullscreenLoading = false;
      })
    },

    loadData() {
      sysApi.getConfig().then(res => {
        this.config = res.data
      });
    }
  },
  created() {
    this.loadData();
  }
}
</script>
<style scoped>

.el-input-number--mini {
  width: 300px;
}

.el-select .el-input {
  width: 300px !important;
}


</style>
