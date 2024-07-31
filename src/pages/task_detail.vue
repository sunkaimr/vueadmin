<template>
  <imp-panel>
    <div style="display: flex; justify-content: space-between;">
    <div style="width: 90%; display: flex;">
      <el-descriptions title="任务详情" size="small" :column=2>
        <el-descriptions-item label="任务ID">{{ taskInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="任务名称">{{ taskInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ taskInfo.created_at }}</el-descriptions-item>
        <el-descriptions-item label="治理方式"> {{ getOptionName(governOption, taskInfo.govern) }}</el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <template v-if="taskInfo.task_reason !== ''">
            <el-tooltip class="item" effect="dark" :content="taskInfo.task_reason" :open-delay="300" placement="top">
              <el-tag size="mini"
                      :style="{ 'background-color': getOptionBackground(taskStatusOption, taskInfo.task_status), color:'#555' }"
                      effect="light">
                {{ getOptionName(taskStatusOption, taskInfo.task_status) }}
              </el-tag>
            </el-tooltip>
          </template>
          <template v-else>
            <el-tag size="mini"
                    :style="{ 'background-color': getOptionBackground(taskStatusOption, taskInfo.task_status), color:'#555' }"
                    effect="light">
              {{ getOptionName(taskStatusOption, taskInfo.task_status) }}
            </el-tag>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="工 作 流">
          <a :href="taskInfo.workflow_url" target="_blank" style="text-decoration: none; margin: 0">{{ taskInfo.workflow }}</a>
        </el-descriptions-item>
        <el-descriptions-item label="说明">{{ taskInfo.description }}</el-descriptions-item>
      </el-descriptions>
    </div>
      <div style="display: flex; justify-content: flex-end; width: 150px; margin-top: 10px">
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(taskInfo)"></el-button>
          <el-button size="mini" icon="el-icon-delete" @click="handleDelete(taskID)"></el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="loadData(taskID)"></el-button>
        </el-button-group>
      </div>
    </div>
    <el-dialog title="修改任务" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false">
      <el-form :model="taskInfo" :rules="rules" size="mini" ref="form">
        <el-form-item class="el-form-item-label" label="任务名称" prop="name" label-width="120px">
          <el-input v-model="taskInfo.name" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="说明" label-width="120px">
          <el-input type="textarea" :rows="2" v-model="taskInfo.description" clearable/>
        </el-form-item>
        <el-form-item label="开启" prop="enable" label-width="120px">
          <el-switch size="mini" v-model="taskInfo.enable"/>
        </el-form-item>
        <el-form-item label="预期执行日期" prop="execute_date" label-width="120px">
          <template>
            <el-date-picker
              placeholder="预期执行日期"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="taskInfo.execute_date">
            </el-date-picker>
          </template>
        </el-form-item>
        <el-form-item label="执行窗口" prop="execute_window" label-width="120px">
          <template>
            <el-time-picker
              placeholder="起始时间"
              v-model="taskInfo.execute_window[0]"
              value-format="HH:mm:ss"
              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
            </el-time-picker>
            <span>&nbsp;-&nbsp;</span>
            <el-time-picker
              placeholder="结束时间"
              v-model="taskInfo.execute_window[1]"
              value-format="HH:mm:ss"
              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
            </el-time-picker>
          </template>
        </el-form-item>
        <el-form-item v-if="taskInfo.govern === 'delete'" label="重建表" prop="rebuild_flag" label-width="120px">
          <template slot="label">
            窗口外重建表
            <el-tooltip placement="top">
              <div slot="content">在执行窗口外是否执行重建表操作<br/>是：在执行窗口外仍然执行重建表操作<br/>否：在执行窗口外跳过重建表操作</div>
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <el-radio-group size="mini" v-model="taskInfo.rebuild_flag">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="通知策略" prop="notify_policy" label-width="120px">
          <el-select v-model="taskInfo.notify_policy" placeholder="请选择">
            <el-option v-for="i in notifyPolicyOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关注人" label-width="120px">
          <el-input v-model="taskInfo.relevant" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
        <el-button size="mini" type="primary" @click="onEditSubmit('form')"
                   v-loading.fullscreen.lock="fullscreenLoading">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-tabs v-model="activeTable" @tab-click="activeTableChanged">
      <el-tab-pane label="任务详情" name="info">
        <el-descriptions size="small" :column="2" border>
          <el-descriptions-item label="创建人">{{ taskInfo.creator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ taskInfo.created_at }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ taskInfo.editor }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ taskInfo.updated_at }}</el-descriptions-item>
          <el-descriptions-item label="开启">{{ taskInfo.enable ? "开启" : "关闭" }}</el-descriptions-item>
          <el-descriptions-item label="策略ID">
              <a style="cursor: pointer; color: blueviolet" @click="gotoPolicyDetail(taskInfo.policy_id)">{{taskInfo.policy_id}}</a>
          </el-descriptions-item>
          <el-descriptions-item label="计划执行日期">{{ taskInfo.execute_date }}</el-descriptions-item>
          <el-descriptions-item label="执行窗口">{{ taskInfo.execute_window[0] +' - '+ taskInfo.execute_window[1]}}</el-descriptions-item>

          <el-descriptions-item label="源端ID">{{ taskInfo.src_id }}</el-descriptions-item>
          <el-descriptions-item label="源端名称">{{ taskInfo.src_name }}</el-descriptions-item>
          <el-descriptions-item label="源端BU">{{ taskInfo.src_bu }}</el-descriptions-item>
          <el-descriptions-item label="源端集群ID">{{ taskInfo.src_cluster_id }}</el-descriptions-item>
          <el-descriptions-item label="源端库名">{{ taskInfo.src_database_name }}</el-descriptions-item>
          <el-descriptions-item label="源端表名">
            <div class="ellipsis-container">
              <template v-if="taskInfo.src_tables_name.length>30">
                <el-tooltip effect="light" :content="taskInfo.src_tables_name.split(',').join(' ')" :open-delay="500" placement="top">
                  <div class="table-expand-cell-ellipsis">{{ taskInfo.src_tables_name }}</div>
                </el-tooltip>
                <el-button v-if="taskInfo.src_tables_name.length>30" type="text" class="copy-button" @click="copyText(taskInfo.src_tables_name)">复制</el-button>
              </template>
              <template v-else>
                <div class="table-expand-cell-ellipsis">{{ taskInfo.src_tables_name }}</div>
              </template>
            </div>
          </el-descriptions-item>
          <template v-if="taskInfo.govern === 'archive'">
            <el-descriptions-item label="目标端ID">{{ taskInfo.dest_id }}</el-descriptions-item>
            <el-descriptions-item label="目标端名称">{{ taskInfo.dest_name }}</el-descriptions-item>
            <el-descriptions-item label="归档介质">{{ taskInfo.dest_storage }}</el-descriptions-item>
            <el-descriptions-item label="连接ID">{{ taskInfo.dest_connection_id }}</el-descriptions-item>
            <el-descriptions-item label="归档库名">{{taskInfo.dest_database_name }}</el-descriptions-item>
            <el-descriptions-item label="归档表名">{{ taskInfo.dest_table_name }}</el-descriptions-item>
            <el-descriptions-item label="压缩存储">{{ taskInfo.dest_compress ? "是" : "否" }} </el-descriptions-item>
            <el-descriptions-item label=""></el-descriptions-item>
          </template>

          <el-descriptions-item label="治理方式"> {{ getOptionName(governOption, taskInfo.govern) }}</el-descriptions-item>
          <el-descriptions-item label="治理条件"> {{ taskInfo.condition}} </el-descriptions-item>
          <el-descriptions-item label="治理速度">{{ getOptionName(cleaningSpeedOption, taskInfo.cleaning_speed) }}</el-descriptions-item>
          <el-descriptions-item label="窗口外重建表">{{ taskInfo.rebuild_flag ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="原因">{{ taskInfo.task_reason }}</el-descriptions-item>
          <el-descriptions-item label="详情">{{ taskInfo.task_detail }}</el-descriptions-item>
          <el-descriptions-item label="任务开始时间">{{ taskInfo.task_start_time }}</el-descriptions-item>
          <el-descriptions-item label="任务结束时间">{{ taskInfo.task_end_time }}</el-descriptions-item>
          <el-descriptions-item label="治理数据行数">{{ taskInfo.task_result_quantity }}</el-descriptions-item>
          <el-descriptions-item label="治理数据大小(MB)">{{ taskInfo.task_result_size }}</el-descriptions-item>
          <el-descriptions-item label="任务执行时长">{{ formatSecondsPrecisely(taskInfo.task_duration) }} </el-descriptions-item>
          <el-descriptions-item label="通知策略">{{ getOptionName(notifyPolicyOption, taskInfo.notify_policy)}}</el-descriptions-item>
          <el-descriptions-item label="相关人">{{ taskInfo.relevant }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="状态记录" name="changelog">
        <div style="margin: 20px">
          <el-timeline :reverse="true">
            <el-timeline-item
              v-for="(log, index) in changelog"
              :key="index"
              :timestamp="log.time">
              <span>
                <el-tag size="small" :style="{'background-color': getOptionBackground(taskStatusOption, log.task_status)}"> {{ getOptionName(taskStatusOption, log.task_status) }}</el-tag>
                <el-tag size="small" effect="light">{{log.user_name}}</el-tag>
                 {{log.content}}
              </span>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改记录" name="revision">
        <el-table
          :data="revisionTableData.rows"
          border
          style="width: 100%;"
          size="mini"
          stripe
          v-loading="listLoading">
          <el-table-column prop="created_at" label="修改时间" align="center" sortable/>
          <el-table-column prop="creator" label="修改人" align="center" sortable/>
          <el-table-column prop="modify_field" label="修改字段" align="center" sortable>
            <template slot-scope="scope">
              {{ getOptionName(taskNameMap, scope.row.modify_field) }}
            </template>
          </el-table-column>
          <el-table-column prop="old_value" label="原始值" align="center" sortable/>
          <el-table-column prop="new_value" label="修改值" align="center" sortable/>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日志" name="log">日志</el-tab-pane>
    </el-tabs>
  </imp-panel>
</template>

<script>
import panel from "../components/panel.vue"
import * as api from "../api"
import * as sysApi from '../services/sys'
import {
  governOption,
  notifyPolicyOption,
  periodOption,
  taskSearchOption,
  getOptionName,
  taskStatusOption,
  getOptionBackground,
  cleaningSpeedOption,
  taskNameMap,
  tableExpandLabelStyle,
  tableExpandContentStyle, formatSecondsPrecisely, copyText,Task,gotoPolicyDetail,
} from "../common/utils";

export default {
  components: {
    'imp-panel': panel
  },

  data() {
    return {
      dialogEditFormVisible: false,
      activeTable: "info",
      taskID: 0,
      taskInfo: new Task(),
      tableExpandLabelStyle,
      tableExpandContentStyle,
      taskNameMap,
      taskStatusRadio: 0,
      periodOption,
      governOption,
      taskStatusOption,
      cleaningSpeedOption,
      notifyPolicyOption,
      taskSearchOption,
      listLoading: false,
      fullscreenLoading: false,
      rules: {
        name: [
          {required: true, message: '请输入任务名称', trigger: 'blur'},
        ],
        enable: [
          {required: true, message: '是否开启', trigger: 'blur'}
        ],
        execute_date: [
          {required: true, message: '请选择期望执行日期', trigger: 'blur'}
        ],
        execute_window: [
          {required: true, message: '请选择执行窗口', trigger: 'blur'}
        ],
        notify_policy: [
          {required: true, message: '请选择通知策略', trigger: 'blur'}
        ]
      },
      revisionTableData: {
        rows: []
      },
      changelog: [],
    }
  },
  methods: {
    gotoPolicyDetail,
    Task,
    copyText,
    formatSecondsPrecisely,
    getOptionBackground,
    getOptionName,
    activeTableChanged(tab) {
      this.activeTable = tab.name;
      window.localStorage.setItem("taskDetailActiveTable", this.activeTable);
      switch (tab.name) {
        case "info":
          break;
        case "revision":
          this.getRevision(this.taskID);
          break;
        case "log":
          break;
        case "changelog":
          this.getChangelog(this.taskID)
          break;
      }
    },
    cancelEditSubmit(formName) {
      this.$refs[formName].resetFields();
      this.fullscreenLoading = false;
      this.dialogEditFormVisible = false;
    },
    onEditSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }

        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 30000);

        const para = {
          id: this.taskInfo.id,
          name: this.taskInfo.name,
          description: this.taskInfo.description,
          enable: this.taskInfo.enable,
          execute_date: this.taskInfo.execute_date,
          execute_window: this.taskInfo.execute_window,
          rebuild_flag: this.taskInfo.rebuild_flag,
          notify_policy: this.taskInfo.notify_policy,
          relevant: this.taskInfo.relevant.split(/[ ,;]+/),
        }
        this.$http.put(api.TASK_LIST, JSON.stringify(para)).then(res => {
          this.fullscreenLoading = false;
          this.dialogEditFormVisible = false;
          this.$refs[formName].resetFields();
          this.$notify({title: '成功', message: "修改成功", type: 'success'});
          this.loadData(this.taskInfo.id);
        }).catch(() => {
          this.fullscreenLoading = false;
        })
      });
    },

    handleEdit(task) {
      this.dialogEditFormVisible = true;
    },
    handleDelete(taskID) {
      this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(api.TASK_LIST, {
          data: JSON.stringify({id: taskID}),
        }).then(res => {
          this.$router.push({path: "/task"});
          this.$notify({title: '成功', message: "删除成功", type: 'success'});
        });
      }).catch(() => {
      });
    },
    getRevision(task_id) {
      this.revisionTableData.rows = [];
      sysApi.getTaskRevision({
        task_id,
        pageSize: 50,
        page: 0,
      }).then(res => {
        this.revisionTableData.rows = res.data.items;
      });
    },
    getChangelog(task_id) {
      this.changelog = [];
      sysApi.getTaskChangelog({
        task_id
      }).then(res => {
        this.changelog = res.data.items;
      });
    },
    loadData(id) {
      sysApi.taskList({ id }).then(res => {
        this.taskInfo = res.data.items[0];
        this.taskInfo.relevant = this.taskInfo.relevant.join(',');
        if ( this.taskID === '' || this.taskID === 0 ) {
          this.taskID = this.taskInfo.id
        }
        this.activeTableChanged({name: this.activeTable})
      });
    },
  },
  created() {
    if ( this.$route.query && this.$route.query.task_id ){
      this.loadData(this.$route.query.task_id);
    }else{
      this.loadData("");
    }
    this.activeTable = window.localStorage.getItem("taskDetailActiveTable");
    this.activeTable = this.activeTable === null ? 'info' : this.activeTable
  }
}
</script>

<style lang="css" scoped>
@import "../../static/css/main.less";

.el-timeline-item span {
  font-size: 12px;

  .el-tag{
    width: 100px;
    text-align: center;
    color: #555;
    margin-right: 8px;
  }

  .el-tag:last-child{
    width: 60px;
  }
}

.el-radio-group {
  height: 28px;
  display: flex;
  align-items: center;
}
</style>
