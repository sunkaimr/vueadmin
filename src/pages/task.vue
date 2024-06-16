<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="24" style="display: flex; align-items: flex-end;">
          <div style="display: flex; margin-left: auto; ustify-items: center; align-items: center;">
            <el-checkbox size="small" v-model="displayEnableTask" @change="handleSearch" style="margin-right: 20px;">只看开启</el-checkbox>
            <el-select size="small" v-model="searchTaskStatus" @change="handleSearch" placeholder="请选择任务状态" style="margin-right: 20px;">
              <el-option key="all" label="ALL" value="all"></el-option>
              <el-option v-for="item in taskStatusOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in taskSearchOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-button size="small" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
            <el-button size="small" icon="el-icon-refresh" @click="handleSearch" style="margin-left: 10px;"/>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%;"
        size="mini"
        stripe
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions
              border
              column=3
              size="mini"
              class="table-expand"
              labelStyle="min-width: 80px;"
              with="100%" >
              <el-descriptions-item label="ID">{{ props.row.id }}</el-descriptions-item>
              <el-descriptions-item label="策略名称">{{ props.row.name }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ props.row.created_at }}</el-descriptions-item>
              <el-descriptions-item label="创建人"> {{ props.row.creator }} </el-descriptions-item>
              <el-descriptions-item label="BU">{{ props.row.bu }}</el-descriptions-item>
              <el-descriptions-item label="清理频率">{{ getOptionName(periodOption, props.row.period) }}</el-descriptions-item>
              <el-descriptions-item label="期望执行日">{{ props.row.day }}</el-descriptions-item>
              <el-descriptions-item label="执行窗口">{{ props.row.execute_window[0] +' - '+  props.row.execute_window[1] }}</el-descriptions-item>
              <el-descriptions-item label="源端ID">{{ props.row.src_id }}</el-descriptions-item>
              <el-descriptions-item label="目标端ID">{{ props.row.dest_id }}</el-descriptions-item>
              <el-descriptions-item label="治理方式">{{ getOptionName(governOption, props.row.govern) }}</el-descriptions-item>
              <el-descriptions-item label="清理速度">{{ getOptionName(cleaningSpeedOption, props.row.cleaning_speed) }}</el-descriptions-item>
              <el-descriptions-item label="通知策略">{{ getOptionName(notifyPolicyOption, props.row.notify_policy) }}</el-descriptions-item>
              <el-descriptions-item label="相关人">{{ props.row.relevant.join(",") }}</el-descriptions-item>
              <el-descriptions-item label="清理条件">{{ props.row.condition }}</el-descriptions-item>
              <el-descriptions-item label="说明">{{ props.row.description }}</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
        <el-table-column prop="enable" label="开启" align="center" width="100px" sortable>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable" size="mini" @change="handleEnableChange(scope.$index, scope.row)"/>
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
            <el-tag size="mini" :style="{ 'background-color': getOptionBackground(taskStatusOption, scope.row.task_status), color:'#555' }" effect="light">
              {{getOptionName(taskStatusOption, scope.row.task_status)}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" class="el-icon-edit"></el-button>
            <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" class="el-icon-delete" style="color: red;"></el-button>
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
  } from "../common/utils";
  import {TASK_LIST} from "../api";

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        displayEnableTask: false,
        periodOption,
        governOption,
        taskStatusOption,
        cleaningSpeedOption,
        notifyPolicyOption,
        taskSearchOption,
        searchTaskStatus: "all",
        searchKey: 'id',
        searchVal: '',
        dialogEditFormVisible: false,
        dialogAddFormVisible: false,
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
        }
      }
    },
    methods: {
      getOptionBackground,
      getOptionName,
      handleSearch(){
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
      handleSelectionChange(val){
        this.loadData();
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        this.$router.push({path: 'userAdd', query: {id: row.id}})
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
      loadData(){
        let para = {
          [this.searchKey]: this.searchVal,
          pageSize: this.tableData.pagination.pageSize,
          page: this.tableData.pagination.pageNo
        }

        if (this.displayEnableTask) {
          para.enable = true
        }

        if ( this.searchTaskStatus === "all" ){
          para.task_status = "";
        } else {
          para.task_status = this.searchTaskStatus;
        }
        sysApi.taskList(para)
        .then(res => {
          this.tableData.rows = res.data.items;
          this.tableData.pagination.total = res.data.total;
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
</style>
