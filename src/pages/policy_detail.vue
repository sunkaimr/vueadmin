<template>
  <imp-panel>
    <div style="display: flex; justify-content: space-between;">
    <div style="width: 90%; display: flex;">
      <el-descriptions title="策略详情" size="small" :column=2>
        <el-descriptions-item label="策略ID">{{ policyInfo.id }}</el-descriptions-item>
        <el-descriptions-item label="策略名称">{{ policyInfo.name }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ policyInfo.created_at }}</el-descriptions-item>
        <el-descriptions-item label="治理方式"> {{ getOptionName(governOption, policyInfo.govern) }}</el-descriptions-item>
        <el-descriptions-item label="开启">{{ policyInfo.enable ? "开启" : "关闭" }}</el-descriptions-item>
        <el-descriptions-item label="执行窗口">{{ policyInfo.execute_window[0] + ' - ' + policyInfo.execute_window[1] }}</el-descriptions-item>
        <el-descriptions-item label="说明">{{ policyInfo.description }}</el-descriptions-item>
      </el-descriptions>
    </div>
      <div style="display: flex; justify-content: flex-end; width: 150px; margin-top: 10px">
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" @click="handleEdit(policyInfo)"></el-button>
          <el-button size="mini" icon="el-icon-delete" @click="handleDelete(policyID)"></el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="loadData(policyID)"></el-button>
        </el-button-group>
      </div>
    </div>
    <el-dialog title="修改策略" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false">
      <el-form :model="policyInfo" :rules="rules" size="mini" ref="form">
        <el-form-item class="el-form-item-label" label="策略名称" prop="name" label-width="80px">
          <el-input v-model="policyInfo.name" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="说明" label-width="80px">
          <el-input type="textarea" :rows="2" v-model="policyInfo.description" clearable/>
        </el-form-item>
        <el-form-item label="开启" prop="enable" label-width="80px">
          <el-switch size="mini" v-model="policyInfo.enable"/>
        </el-form-item>
        <el-form-item label="治理频率" prop="period" label-width="80px">
          <el-select v-model="policyInfo.period" placeholder="请选择">
            <el-option v-for="i in periodOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
          </el-select>
          <template
            v-if="policyInfo.period !== 'once' && policyInfo.period !== 'day' && policyInfo.period !== 'two-day' && policyInfo.period !== 'weekly'">
            <span>&nbsp;执行一次，当月第&nbsp;</span>
            <el-input-number prop="period" v-model="policyInfo.day" :min="1" :max="31" placeholder=""></el-input-number>
            <span>&nbsp;日执行&nbsp;</span>
          </template>
        </el-form-item>
        <el-form-item label="执行窗口" prop="execute_window" label-width="80px">
          <template>
            <el-time-picker
              placeholder="起始时间"
              v-model="policyInfo.execute_window[0]"
              value-format="HH:mm:ss"
              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
            </el-time-picker>
            <span>&nbsp;-&nbsp;</span>
            <el-time-picker
              placeholder="结束时间"
              v-model="policyInfo.execute_window[1]"
              value-format="HH:mm:ss"
              :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
            </el-time-picker>
          </template>
        </el-form-item>
        <el-form-item label="治理方式" prop="govern" label-width="80px">
          <el-select v-model="policyInfo.govern" disabled placeholder="请选择">
            <el-option v-for="i in governOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="policyInfo.govern === 'delete'" label="重建表" prop="rebuild_flag" label-width="80px">
          <el-radio-group size="small" v-model="policyInfo.rebuild_flag">
            <el-radio :label="true" style="line-height: 30px">在执行窗口外仍然重建</el-radio>
            <el-radio :label="false" style="line-height: 30px">在执行窗口外跳过重建</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="policyInfo.govern !=='truncate' && policyInfo.govern !=='rebuild'" label="治理条件" prop="condition"
                      label-width="80px">
          <el-input type="textarea" :rows="2" v-model="policyInfo.condition" clearable/>
        </el-form-item>
        <el-form-item label="治理速度" prop="cleaning_speed" label-width="80px">
          <el-select v-model="policyInfo.cleaning_speed" placeholder="请选择">
            <el-option v-for="i in cleaningSpeedOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知策略" prop="notify_policy" label-width="80px">
          <el-select v-model="policyInfo.notify_policy" placeholder="请选择">
            <el-option v-for="i in notifyPolicyOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关注人" label-width="80px">
          <el-input v-model="policyInfo.relevant" clearable/>
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
      <el-tab-pane label="策略详情" name="info">
        <el-descriptions size="small" :column="2" border>
          <el-descriptions-item label="创建人">{{ policyInfo.creator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ policyInfo.created_at }}</el-descriptions-item>
          <el-descriptions-item label="更新人">{{ policyInfo.editor }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ policyInfo.updated_at }}</el-descriptions-item>
          <el-descriptions-item label="开启">{{ policyInfo.enable ? "开启" : "关闭" }}</el-descriptions-item>
          <el-descriptions-item label="治理频率">{{getOptionName(periodOption, policyInfo.period)}}</el-descriptions-item>
          <el-descriptions-item label="期望执行日">{{ policyInfo.day }}</el-descriptions-item>
          <el-descriptions-item label="执行窗口">{{ policyInfo.execute_window[0] + ' - ' + policyInfo.execute_window[1] }}</el-descriptions-item>
          <el-descriptions-item label="BU">{{ policyInfo.bu }}</el-descriptions-item>
          <el-descriptions-item label="源端ID">{{ policyInfo.src_id }}</el-descriptions-item>
          <el-descriptions-item label="源端名称">{{ policyInfo.src_name }}</el-descriptions-item>
          <el-descriptions-item label="源端集群名称">{{ policyInfo.src_cluster_name }}</el-descriptions-item>
          <el-descriptions-item label="源端集群ID">{{ policyInfo.src_cluster_id }}</el-descriptions-item>
          <el-descriptions-item label="源库名">{{ policyInfo.src_database_name }}</el-descriptions-item>
          <el-descriptions-item label="源表名">
            <div class="ellipsis-container">
              <template v-if="policyInfo.src_tables_name.length>30">
                <el-tooltip effect="light" :content="policyInfo.src_tables_name.split(',').join(' ')" :open-delay="500" placement="top">
                  <div class="table-expand-cell-ellipsis">{{ policyInfo.src_tables_name }}</div>
                </el-tooltip>
                <el-button v-if="policyInfo.src_tables_name.length>30" type="text" class="copy-button" @click="copyText(policyInfo.src_tables_name)">复制</el-button>
              </template>
              <template v-else>
                <div class="table-expand-cell-ellipsis">{{policyInfo.src_tables_name }}</div>
              </template>
            </div>
          </el-descriptions-item>
          <template v-if="policyInfo.govern === 'archive'">
            <el-descriptions-item label="归档范围">{{ policyInfo.archive_scope }}</el-descriptions-item>
            <el-descriptions-item label="目标端ID">{{ policyInfo.dest_id }}</el-descriptions-item>
            <el-descriptions-item label="目标端名称">{{ policyInfo.dest_name }}</el-descriptions-item>
            <el-descriptions-item label="归档介质">{{ policyInfo.dest_storage }}</el-descriptions-item>
            <el-descriptions-item label="连接ID">{{ policyInfo.dest_connection_id }}</el-descriptions-item>
            <el-descriptions-item label="归档库名">{{ policyInfo.dest_database_name }}</el-descriptions-item>
            <el-descriptions-item label="归档表名">{{ policyInfo.dest_table_name }}</el-descriptions-item>
            <el-descriptions-item label="压缩存储">{{ policyInfo.dest_compress ? "是" : "否" }}</el-descriptions-item>
            <el-descriptions-item label=""></el-descriptions-item>
          </template>
          <el-descriptions-item label="窗口外重建表">{{ policyInfo.rebuild_flag ? "是" : "否" }}</el-descriptions-item>
          <el-descriptions-item label="治理方式"> {{ getOptionName(governOption, policyInfo.govern) }}</el-descriptions-item>
          <el-descriptions-item label="治理条件"> {{ policyInfo.condition }}</el-descriptions-item>
          <el-descriptions-item label="治理速度">{{ getOptionName(cleaningSpeedOption, policyInfo.cleaning_speed) }}</el-descriptions-item>
          <el-descriptions-item label="通知策略">{{ getOptionName(notifyPolicyOption, policyInfo.notify_policy) }}</el-descriptions-item>
          <el-descriptions-item label="相关人">{{ policyInfo.relevant }}</el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="任务记录" name="tasks">
        <el-table
          :data="taskList.rows"
          border
          style="width: 100%;"
          size="mini"
          stripe
          v-loading="listLoading">
          <el-table-column prop="id" label="ID" width="80px" align="center" sortable>
            <template slot-scope="scope">
              <a style="cursor: pointer; color: blueviolet" @click="gotoTaskDetail(scope.row.id)">{{scope.row.id}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="enable" label="开启" align="center" width="100px" sortable>
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enable" size="mini" disabled/>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="任务名称" sortable>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.name" :open-delay="1000" placement="top">
                <div class="cell-ellipsis">{{ scope.row.name }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="govern" label="治理方式" align="center" width="100px" sortable>
            <template slot-scope="scope">{{ getOptionName(governOption, scope.row.govern) }}</template>
          </el-table-column>
            <el-table-column prop="cleaning_speed" label="治理速度" align="center" width="100px" sortable>
              <template slot-scope="scope">
                {{ getOptionName(cleaningSpeedOption, scope.row.cleaning_speed ) }}
              </template>
            </el-table-column>
          <el-table-column prop="execute_date" label="计划执行日期" align="center" width="120px" sortable></el-table-column>
          <el-table-column prop="execute_window" label="执行窗口" align="center" width="150px" sortable>
            <template slot-scope="scope">{{ scope.row.execute_window[0] + '-' + scope.row.execute_window[1] }}</template>
          </el-table-column>
          <el-table-column prop="task_start_time" label="开始执行时间" align="center" width="140px" sortable>
          </el-table-column>
          <el-table-column prop="task_status" label="任务状态" align="center" width="100px" sortable>
            <template slot-scope="scope">
              <template v-if="scope.row.task_reason !== ''">
                <el-tooltip class="item" effect="dark" :content="scope.row.task_reason" :open-delay="300" placement="top">
                  <el-tag size="mini"
                          :style="{ 'background-color': getOptionBackground(taskStatusOption, scope.row.task_status), color:'#555' }"
                          effect="light">
                    {{ getOptionName(taskStatusOption, scope.row.task_status) }}
                  </el-tag>
                </el-tooltip>
              </template>
              <template v-else>
                <el-tag size="mini"
                        :style="{ 'background-color': getOptionBackground(taskStatusOption, scope.row.task_status), color:'#555' }"
                        effect="light">
                  {{ getOptionName(taskStatusOption, scope.row.task_status) }}
                </el-tag>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="taskList.pagination.pageNo"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="taskList.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="taskList.pagination.total">
        </el-pagination>
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
              {{ getOptionName(policyNameMap, scope.row.modify_field) }}
            </template>
          </el-table-column>
          <el-table-column prop="old_value" label="原始值" align="center" sortable/>
          <el-table-column prop="new_value" label="修改值" align="center" sortable/>
        </el-table>
      </el-tab-pane>
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
  tableExpandLabelStyle,
  tableExpandContentStyle,
  copyText,
  Policy,
  gotoTaskDetail,
  gotoPolicyDetail,
  policyNameMap,
} from "../common/utils";

export default {
  components: {
    'imp-panel': panel
  },

  data() {
    return {
      dialogEditFormVisible: false,
      activeTable: "info",
      policyID: 0,
      policyInfo: new Policy(),
      tableExpandLabelStyle,
      tableExpandContentStyle,
      policyNameMap,
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
          {required: true, message: '请输入策略名称', trigger: 'blur'},
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
      taskList: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
    }
  },
  methods: {
    gotoPolicyDetail,
    gotoTaskDetail,
    copyText,
    getOptionBackground,
    getOptionName,
    activeTableChanged(tab) {
      this.activeTable = tab.name;
      window.localStorage.setItem("policyDetailActiveTable", this.activeTable);
      switch (tab.name) {
        case "info":
          break;
        case "revision":
          this.getRevision(this.policyID);
          break;
        case "tasks":
          this.getTaskList(this.policyID)
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
          id: this.policyInfo.id,
          name: this.policyInfo.name,
          description: this.policyInfo.description,
          enable: this.policyInfo.enable,
          period: this.policyInfo.period,
          day: this.policyInfo.day,
          execute_window: this.policyInfo.execute_window,
          govern: this.policyInfo.govern,
          rebuild_flag: this.policyInfo.rebuild_flag,
          condition: this.policyInfo.condition,
          cleaning_speed: this.policyInfo.cleaning_speed,
          notify_policy: this.policyInfo.notify_policy,
          relevant: this.policyInfo.relevant.split(/[ ,;]+/),
        }
        this.$http.put(api.POLICY_ADD, JSON.stringify(para)).then(res => {
          this.fullscreenLoading = false;
          this.dialogEditFormVisible = false;
          this.$refs[formName].resetFields();
          this.$notify({title: '成功', message: "修改成功", type: 'success'});
          this.loadData(this.policyID);
        }).catch(() => {
          this.fullscreenLoading = false;
        })
      });
    },

    handleEdit(task) {
      this.dialogEditFormVisible = true;
    },
    handleDelete(policyID) {
      this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(api.POLICY_LIST, {
          data: JSON.stringify({id: policyID}),
        }).then(res => {
          this.$router.push({path: "/policy"});
          this.$notify({title: '成功', message: "删除成功", type: 'success'});
        });
      }).catch(() => {
      });
    },
    getRevision(policy_id) {
      this.revisionTableData.rows = [];
      sysApi.getPolicyRevision({
        policy_id,
        pageSize: 50,
        page: 0,
      }).then(res => {
        this.revisionTableData.rows = res.data.items;
      });
    },
    getTaskList(policy_id) {
      let para = {
        policy_id,
        pageSize: this.taskList.pagination.pageSize,
        page: this.taskList.pagination.pageNo
      }
      sysApi.taskList(para).then(res => {
        this.taskList.rows = res.data.items;
        this.taskList.pagination.total = res.data.total;
      });
    },
    handleSizeChange(val) {
      this.taskList.pagination.pageNo = 1;
      this.taskList.pagination.pageSize = val;
      this.loadData();
      window.localStorage.setItem("taskPageSize", val)
    },
    handleCurrentChange(val) {
      this.taskList.pagination.pageNo = val;
      this.loadData();
    },
    loadData(id) {
      sysApi.policyList({ id }).then(res => {
        this.policyInfo = res.data.items[0];
        this.policyInfo.relevant = this.policyInfo.relevant.join(',');
        if ( this.policyID === '' || this.policyID === 0 ) {
          this.policyID = this.policyInfo.id
        }
        this.activeTableChanged({name: this.activeTable})
      });
    },
  },
  created() {
    if ( this.$route.query && this.$route.query.policy_id ){
      this.loadData(this.$route.query.policy_id);
    }else{
      this.loadData("");
    }
    this.activeTable = window.localStorage.getItem("policyDetailActiveTable");
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

  .el-tag:first-child{
    width: 60px;
  }

}
</style>
