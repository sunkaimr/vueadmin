<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="14" style="display: flex; justify-content: flex-end;">
          <div style="display: flex; align-items: center; height: 50px">
            <el-radio-group size="mini" @input="taskStatusRadioChanged" v-model="taskStatusRadio">
              <el-radio :label="1">未执行</el-radio>
              <el-radio :label="2">执行中</el-radio>
              <el-radio :label="3">已执行</el-radio>
              <el-radio :label="0">全部</el-radio>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="10" style="display: flex; align-items: flex-end;">
          <div style="display: flex; margin-left: auto; justify-items: center; align-items: center; height: 50px">
            <el-select size="small" v-model="searchTaskStatus" @change="handleSearch" placeholder="任务状态" multiple clearable style="max-height: 32px; overflow-x: hidden; overflow-y: hidden; margin-right: 10px;">
              <el-option v-for="item in taskStatusOption" :key="item.value" :label="item.name" :value="item.value" style="font-size: 12px"></el-option>
            </el-select>
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in taskSearchOption" :key="item.value" :label="item.name" :value="item.value" style="font-size: 12px"></el-option>
              </el-select>
              <el-button size="small" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
            <el-button size="small" icon="el-icon-refresh" @click="handleSearch" style="margin-left: 10px;"/>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-dialog title="修改任务" :visible.sync="dialogEditFormVisible" :rules="rules" :close-on-click-modal="false" style="width: 100%;">
        <el-form :model="form" :rules="rules" size="mini" ref="form">
          <el-form-item class="el-form-item-label" label="任务名称" prop="name" label-width="120px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="说明" label-width="120px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="开启" prop="enable" label-width="120px">
            <el-switch size="mini" v-model="form.enable" />
          </el-form-item>
          <el-form-item label="预期执行日期" prop="execute_date" label-width="120px">
            <template>
              <el-date-picker
                placeholder="预期执行日期"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="form.execute_date">
              </el-date-picker>
            </template>
          </el-form-item>
          <el-form-item label="执行窗口" prop="execute_window" label-width="120px">
            <template>
              <el-time-picker
                placeholder="起始时间"
                v-model="form.execute_window[0]"
                value-format="HH:mm:ss"
                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
              </el-time-picker>
              <span>&nbsp;-&nbsp;</span>
              <el-time-picker
                placeholder="结束时间"
                v-model="form.execute_window[1]"
                value-format="HH:mm:ss"
                :picker-options="{selectableRange: '00:00:00 - 23:59:59'}">
              </el-time-picker>
            </template>
          </el-form-item>
          <el-form-item label="通知策略" prop="notify_policy" label-width="120px">
            <el-select v-model="form.notify_policy" placeholder="请选择">
              <el-option v-for="i in notifyPolicyOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关注人" label-width="120px">
            <el-input v-model="form.relevant" clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onEditSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改记录" :visible.sync="dialogRevisionFormVisible" :close-on-click-modal="false" style="width: 100%;">
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
      </el-dialog>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%;"
        size="mini"
        stripe
        v-loading="listLoading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions
              border
              size="mini"
              class="table-expand"
              :column=3
              :labelStyle="tableExpandLabelStyle"
              :contentStyle='tableExpandContentStyle'
              with="100%" >
              <el-descriptions-item label="ID">{{ props.row.id }}</el-descriptions-item>
              <el-descriptions-item label="任务名称">{{ props.row.name }}</el-descriptions-item>
              <el-descriptions-item label="说明">{{ props.row.description }}</el-descriptions-item>
<!--              <el-descriptions-item label="开启">{{ props.row.enable }}</el-descriptions-item>-->
<!--              <el-descriptions-item label="创建人"> {{ props.row.creator }} </el-descriptions-item>-->
              <el-descriptions-item label="创建时间">{{ props.row.created_at }}</el-descriptions-item>
              <el-descriptions-item label="策略ID">{{ props.row.policy_id }}</el-descriptions-item>
              <el-descriptions-item label="预期执行日期">{{ props.row.execute_date }}</el-descriptions-item>
              <el-descriptions-item label="执行窗口">{{ props.row.execute_window[0] +' - '+  props.row.execute_window[1] }}</el-descriptions-item>
              <el-descriptions-item label="治理方式">{{ getOptionName(governOption, props.row.govern) }}</el-descriptions-item>
              <el-descriptions-item label="清理速度">{{ getOptionName(cleaningSpeedOption, props.row.cleaning_speed) }}</el-descriptions-item>
              <el-descriptions-item label="清理条件">{{ props.row.condition }}</el-descriptions-item>
              <el-descriptions-item label="通知策略">{{ getOptionName(notifyPolicyOption, props.row.notify_policy) }}</el-descriptions-item>
              <el-descriptions-item label="相关人">{{ props.row.relevant.join(",") }}</el-descriptions-item>

              <el-descriptions-item label="源端ID">{{ props.row.src_id }}</el-descriptions-item>
              <el-descriptions-item label="源端名称">{{ props.row.src_name }}</el-descriptions-item>
              <el-descriptions-item label="集群ID">{{ props.row.cluster_id }}</el-descriptions-item>
              <el-descriptions-item label="集群名称">{{ props.row.src_cluster_name }}</el-descriptions-item>
              <el-descriptions-item label="源库名">{{ props.row.src_database_name }}</el-descriptions-item>
              <el-descriptions-item label="源表名">{{ props.row.src_tables_name }}</el-descriptions-item>
              <el-descriptions-item label="源列名">{{ props.row.src_columns }}</el-descriptions-item>
<!--              <el-descriptions-item label="源端磁盘剩余">{{ props.row.src_cluster_free_disk }}</el-descriptions-item>-->
<!--              <el-descriptions-item label="清理前表大小">{{ props.row.src_cluster_sum_table_size }}</el-descriptions-item>-->
              <template v-if="props.row.govern === 'archive'">
                <el-descriptions-item label="目标端ID">{{ props.row.dest_id }}</el-descriptions-item>
                <el-descriptions-item label="目标端名称">{{ props.row.dest_name }}</el-descriptions-item>
                <el-descriptions-item label="归档介质">{{ props.row.dest_storage }}</el-descriptions-item>
                <el-descriptions-item label="连接ID">{{ props.row.dest_connection_id }}</el-descriptions-item>
                <el-descriptions-item label="归档库名">{{ props.row.dest_database_name }}</el-descriptions-item>
                <el-descriptions-item label="归档表名">{{ props.row.dest_table_name }}</el-descriptions-item>
                <el-descriptions-item label="压缩存储">{{ props.row.dest_compress ? "是" : "否" }}</el-descriptions-item>
              </template>
              <el-descriptions-item label="任务状态">{{ getOptionName(taskStatusOption,props.row.task_status) }}</el-descriptions-item>
              <el-descriptions-item label="任务错误原因">{{ props.row.task_reason }}</el-descriptions-item>
              <el-descriptions-item label="任务错误详情">{{ props.row.task_detail }}</el-descriptions-item>
              <el-descriptions-item label="清理数据行量">{{ props.row.task_result_quantity }}</el-descriptions-item>
              <el-descriptions-item label="清理数据容量">{{ props.row.task_result_size }}</el-descriptions-item>
              <el-descriptions-item label="任务开始时间">{{ props.row.task_start_time }}</el-descriptions-item>
              <el-descriptions-item label="任务结束时间">{{ props.row.task_end_time }}</el-descriptions-item>
              <el-descriptions-item label="执行时长(秒)">{{ props.row.task_duration }}</el-descriptions-item>
              <el-descriptions-item label="工作流ID">{{ props.row.workflow }}</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
        <el-table-column prop="enable" label="开启" align="center" width="100px" sortable>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable"
                       size="mini"
                       :disabled="taskCanModify(scope.row.task_status)"
                       @change="handleEnableChange(scope.$index, scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="policy_id" label="策略ID" align="center" width="90px" sortable> </el-table-column>
        <el-table-column prop="name" label="任务名称" sortable> </el-table-column>
        <el-table-column prop="govern" label="清理方式" align="center" width="100px" sortable>
          <template slot-scope="scope">{{getOptionName(governOption, scope.row.govern)}}</template>
        </el-table-column>
        <el-table-column prop="cleaning_speed" label="清理速度" align="center" width="100px" sortable>
          <template slot-scope="scope">
            {{ getOptionName(cleaningSpeedOption, scope.row.cleaning_speed ) }}
          </template>
        </el-table-column>
        <el-table-column prop="execute_date" label="计划执行日期" align="center" width="120px" sortable></el-table-column>
        <el-table-column prop="execute_window" label="执行窗口" align="center" width="150px" sortable>
          <template slot-scope="scope">{{ scope.row.execute_window[0] +'-'+ scope.row.execute_window[1] }}</template>
        </el-table-column>
        <el-table-column prop="task_status" label="任务状态" align="center" width="100px" sortable>
          <template slot-scope="scope">
            <template v-if="scope.row.task_reason !== ''">
              <el-tooltip class="item" effect="dark" :content="scope.row.task_reason" :open-delay="500" placement="top">
                <el-tag size="mini" :style="{ 'background-color': getOptionBackground(taskStatusOption, scope.row.task_status), color:'#555' }" effect="light">
                  {{getOptionName(taskStatusOption, scope.row.task_status)}}
                </el-tag>
              </el-tooltip>
            </template>
            <template v-else>
                <el-tag size="mini" :style="{ 'background-color': getOptionBackground(taskStatusOption, scope.row.task_status), color:'#555' }" effect="light">
                  {{getOptionName(taskStatusOption, scope.row.task_status)}}
                </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-dropdown size="small" @command="handleDropdownCommand" :hide-on-click="false">
              <span class="el-dropdown-link">更多 <i class="el-icon-arrow-down"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="beforeHandleDropdownCommand(scope.$index, scope.row, 'edit')" icon="el-icon-edit"> 修改 </el-dropdown-item>
                <el-dropdown-item :command="beforeHandleDropdownCommand(scope.$index, scope.row, 'delete')" icon="el-icon-delete"> 删除 </el-dropdown-item>
                <el-dropdown-item :command="beforeHandleDropdownCommand(scope.$index, scope.row, 'revision')" icon="el-icon-tickets"> 修改记录 </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.pagination.pageNo"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="tableData.pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pagination.total">
      </el-pagination>
    </div>
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
    beforeHandleDropdownCommand,
    tableExpandLabelStyle,
    tableExpandContentStyle,
  } from "../common/utils";

  export default {
    components: {
      'imp-panel': panel
    },
    watch:{
      searchTaskStatus: function (newVal, oldVal){
        if (newVal !== oldVal) {
          window.localStorage.setItem("searchTaskStatus", newVal);
        }
      },
      searchKey: function (newVal, oldVal){
        if (newVal !== oldVal) {
          window.localStorage.setItem("taskSearchKey", newVal);
        }
      },
      taskStatusRadio: function (newVal, oldVal){
        if (newVal !== oldVal) {
          window.localStorage.setItem("taskStatusRadio", newVal);
        }
      },
    },
    data(){
      return {
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
        searchTaskStatus: [],
        searchKey: 'id',
        searchVal: '',
        dialogEditFormVisible: false,
        dialogAddFormVisible: false,
        dialogRevisionFormVisible: false,
        fullscreenLoading: false,
        listLoading: false,
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        form:{
          name: "",
          description: "",
          enable: true,
          execute_date: "",
          execute_window: ["00:00:00","23:59:59"],
          notify_policy: "failed",
          relevant: "",
        },
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
          ],
          enable: [
            { required: true, message: '是否开启', trigger: 'blur' }
          ],
          execute_date: [
            { required: true, message: '请选择期望执行日期', trigger: 'blur' }
          ],
          execute_window: [
            { required: true, message: '请选择执行窗口', trigger: 'blur' }
          ],
          notify_policy: [
            { required: true, message: '请选择通知策略', trigger: 'blur' }
          ]
        },
        revisionTableData: {
          rows: []
        },
      }
    },
    methods: {
      getOptionBackground,
      getOptionName,
      beforeHandleDropdownCommand,
      handleDropdownCommand(command){
        switch (command.command) {
          case "edit":
            this.handleEdit(command.index, command.row);
            break;
          case "delete":
            this.handleDelete(command.index, command.row);
            break;
          case "revision":
            this.handleRevision(command.index, command.row);
            break;
        }
      },
      taskCanModify(status){
        return (status === 'executing' || status === 'success' || status === 'exec_failed' || status === 'timeout');
      },
      cancelEditSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogEditFormVisible = false;
      },
      onEditSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }

          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 30000);

          const para = {
            id : this.form.id,
            name : this.form.name,
            description : this.form.description,
            enable : this.form.enable,
            execute_date: this.form.execute_date,
            execute_window: this.form.execute_window,
            notify_policy: this.form.notify_policy,
            relevant: this.form.relevant.split(/[ ,;]+/),
          }
          this.$http.put(api.TASK_LIST, JSON.stringify(para)).then(res => {
            this.fullscreenLoading = false;
            this.dialogEditFormVisible = false;
            this.$refs[formName].resetFields();
            this.$notify({ title: '成功', message: "修改成功", type: 'success' });
            this.loadData();
          }).catch(()=>{
            this.fullscreenLoading = false;
          })
        });
      },
      handleSearch(){
        this.loadData();
      },
      taskStatusRadioChanged(){
        switch (this.taskStatusRadio) {
          case 1:
            this.searchTaskStatus = [ "scheduled", "supplement_failed", "waiting", "exec_check_failed"];
            break
          case 2:
            this.searchTaskStatus = ["executing"];
            break
          case 3:
            this.searchTaskStatus = ["success","failed","timeout"];
            break
          default:
            this.searchTaskStatus = [];
            break
        }
        this.loadData();
      },
      handleEnableChange(index, row){
        const data = {
          id: row.id,
          name: row.name,
          enable: row.enable,
          execute_date: row.execute_date,
          description: row.description,
        }
        this.$http.put(api.TASK_LIST, JSON.stringify(data)).then(res => {
          this.$notify({ title: '成功', message: "修改成功", type: 'success' });
          this.loadData();
        }).catch(()=>{
          this.loadData();
        })
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
        window.localStorage.setItem("taskPageSize", val)
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        this.dialogEditFormVisible = true;
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.description = row.description;
        this.form.enable = row.enable;
        this.form.execute_date = row.execute_date;
        this.form.execute_window = row.execute_window;
        this.form.relevant = row.relevant.join(",");
        this.form.notify_policy = row.notify_policy;
      },
      handleDelete(index, row){
        this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.TASK_LIST,{
            data: JSON.stringify({id: row.id}),
          }).then(res => {
            this.loadData();
            this.$notify({ title: '成功', message: "删除成功", type: 'success' });
          });
        }).catch(() => {
        });
      },
      handleRevision(index, row){
        this.revisionTableData.rows = [];
        sysApi.getTaskRevision({
          task_id: row.id,
          pageSize: 0,
          page: 0,
        }).then(res => {
          this.revisionTableData.rows = res.data.items;
        });
        this.dialogRevisionFormVisible = true;
      },
      loadData(){
        let para = {
          [this.searchKey]: this.searchVal,
          pageSize: this.tableData.pagination.pageSize,
          page: this.tableData.pagination.pageNo
        }
        para.task_status = this.searchTaskStatus;

        sysApi.taskList(para).then(res => {
          this.tableData.rows = res.data.items;
          this.tableData.pagination.total = res.data.total;
        });
      }
    },
    created(){
      this.searchTaskStatus = window.localStorage.getItem("searchTaskStatus");
      this.searchTaskStatus = this.searchTaskStatus === null ? "all" : this.searchTaskStatus;

      this.searchKey = window.localStorage.getItem("taskSearchKey");
      this.searchKey = this.searchKey === null ? "id" : this.searchKey;

      const pageSize = parseInt(window.localStorage.getItem("taskPageSize"), 10);
      this.tableData.pagination.pageSize = Number.isFinite(pageSize) ? pageSize : 10 ;

      const radio =  parseInt(window.localStorage.getItem("taskStatusRadio"));
      this.taskStatusRadio =  Number.isFinite(radio) ? radio : 0;

      switch (this.taskStatusRadio) {
        case 1:
          this.searchTaskStatus = [ "scheduled", "supplement_failed", "waiting", "exec_check_failed"];
          break
        case 2:
          this.searchTaskStatus = ["executing"];
          break
        case 3:
          this.searchTaskStatus = ["success","failed","timeout"];
          break
        default:
          this.searchTaskStatus = [];
          break
      }

      this.loadData();
    }
  }
</script>
<style scoped>
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
    width: 100%;
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

  .el-radio-group {
    display: flex;
    flex-direction: row;
    margin-right: 20px;

    .el-radio {
      display: inline-block;
      margin-right: 10px;
    }
    .el-radio__label{
      font-size: 12px;
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    font-size: 12px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
