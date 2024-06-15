<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="12" style="display: flex; align-items: flex-end;">
          <el-button size="small" type="primary" @click="addPolicy" icon="plus">新增</el-button>
        </el-col>
        <el-col :span="12" style="display: flex; align-items: flex-end;">
          <div style="margin-top: 15px; margin-left: auto;">
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option label="ID" value="id"></el-option>
                <el-option label="策略名称" value="name"></el-option>
                <el-option label="开启" value="enable"></el-option>
                <el-option label="清理频率" value="period"></el-option>
                <el-option label="清理速度" value="cleaning_speed"></el-option>
                <el-option label="源端ID" value="src_id"></el-option>
                <el-option label="治理方式" value="govern"></el-option>
                <el-option label="治理条件" value="condition"></el-option>
                <el-option label="目标端ID" value="dest_id"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-dialog title="添加策略" :visible.sync="dialogAddFormVisible" :rules="rules" style="width: 100%;">
        <el-form :model="form" :rules="rules" size="mini" ref="form">
          <el-form-item class="el-form-item-label" label="策略名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="说明"  label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="开启" prop="enable" label-width="80px">
            <el-switch size="mini" v-model="form.enable"  />
          </el-form-item>
          <el-form-item label="执行频率" prop="period" label-width="80px">
            <el-select v-model="form.period" placeholder="请选择">
              <el-option v-for="i in periodOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
            <span>&nbsp;&nbsp;&nbsp;</span>
            <template v-if="form.period !== 'once' && form.period !== 'day' && form.period !== 'two-day' && form.period !== 'weekly'">
              <el-input-number prop="period" v-model="form.day" :min="1" :max="31" placeholder="计划执行日"></el-input-number>
            </template>
          </el-form-item>
          <el-form-item label="执行窗口" prop="execute_window" label-width="80px">
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
          <el-form-item label="源端ID" prop="src_id" label-width="80px">
            <el-select v-model="form.src_id" placeholder="请选择">
              <el-option v-for="i in sourceList" :key="i.id" :label="i.name" :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="治理方式" prop="govern" label-width="80px">
            <el-select v-model="form.govern" placeholder="请选择">
              <el-option v-for="i in governOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.govern !=='truncate' && form.govern !=='recreate'" label="治理条件" prop="condition" label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.condition" clearable/>
          </el-form-item>
          <el-form-item label="清理速度" prop="cleaning_speed" label-width="80px">
            <el-select v-model="form.cleaning_speed" placeholder="请选择">
              <el-option v-for="i in cleaningSpeedOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.govern === 'archive'" label="目标端ID" label-width="80px">
            <el-select v-model="form.dest_id" placeholder="请选择">
              <el-option v-for="i in destList" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知策略" prop="notify_policy" label-width="80px">
            <el-select v-model="form.notify_policy" placeholder="请选择">
              <el-option v-for="i in notifyPolicyOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关注人" label-width="80px">
            <el-input v-model="form.relevant" clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        size="mini"
        stripe
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form size="small" label-position="left" inline class="table-expand">
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="ID："><span>{{ props.row.id }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="源端名称："><span>{{ props.row.name }}</span></el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="创建时间："><span>{{ props.row.created_at }}</span> </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="创建人："><span>{{ props.row.creator }}</span></el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="BU："><span>{{ props.row.bu }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="集群ID："><span>{{ props.row.cluster_id }}</span></el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="集群名称："><span>{{ props.row.cluster_name }}</span></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="源库名："><span>{{ props.row.database_name }}</span></el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="说明："><span class="word-wrap">{{ props.row.description }}</span></el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="源表名："><span class="word-wrap">{{ props.row.tables_name }}</span></el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80px" sortable> </el-table-column>
        <el-table-column prop="name" label="策略名称" sortable> </el-table-column>
        <el-table-column prop="enable" label="开启" sortable></el-table-column>
        <el-table-column prop="bu" label="BU" sortable> </el-table-column>
        <el-table-column prop="period" label="清理周期" sortable> </el-table-column>
        <el-table-column prop="cleaning_speed" label="清理速度" sortable> </el-table-column>
        <el-table-column prop="govern" label="清理方式" sortable> </el-table-column>
        <el-table-column prop="condition" label="清理条件" sortable> </el-table-column>
        <el-table-column prop="src_id" label="源端ID" sortable> </el-table-column>
<!--        <el-table-column prop="dest_id" label="目标端ID" sortable> </el-table-column>-->
        <el-table-column prop="condition" label="清理条件" sortable>
          <template slot-scope="scope">
            <div class="cell-ellipsis">{{ scope.row.condition }}</div>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="columns" label="列名"> </el-table-column>-->
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
  import testData from "../../static/data/data.json"
  import * as sysApi from '../services/sys'
  import {policyList} from "../services/sys";
  import {POLICY_ADD} from "../api";

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
        searchKey: 'id',
        searchVal: '',
        form:{
          enable:true,
          period: "monthly",
          day:1,
          execute_window: ["00:00:00","23:59:59"],
          govern: "delete",
          cleaning_speed: "steady",
          notify_policy: "failed",
        },
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
        },
        rules: {
          name: [
            { required: true, message: '请输入策略名称', trigger: 'blur' },
          ],
          enable: [
            { required: true, message: '是否开启', trigger: 'blur' }
          ],
          period: [
            { required: true, message: '请选择清理频率', trigger: 'blur' }
          ],
          execute_window: [
            { required: true, message: '请选择执行窗口', trigger: 'blur' }
          ],
          src_id: [
            { required: true, message: '请选择源端ID', trigger: 'blur' }
          ],
          govern: [
            { required: true, message: '请选择数据治理方式', trigger: 'blur' }
          ],
          condition: [
            // { required: true, message: '请输入数据治理条件', trigger: 'blur' }
          ],
          cleaning_speed: [
            { required: true, message: '请选择数据清理速度', trigger: 'blur' }
          ],
          notify_policy: [
            { required: true, message: '请选择通知策略', trigger: 'blur' }
          ]
        },
        periodOption:[
          {name:"一次", value:"once"},
          {name:"每天", value:"day"},
          {name:"两天", value:"two-day"},
          {name:"一周", value:"weekly"},
          {name:"每月", value:"monthly"},
          {name:"每季", value:"quarterly"},
          {name:"半年", value:"six-months"},
          {name:"每年", value:"yearly"},
        ],
        governOption:[
          {name:"清空数据", value:"truncate"},
          {name:"删除数据", value:"delete"},
          {name:"备份后删除", value:"backup-delete"},
          {name:"归档数据", value:"archive"},
          {name:"重建表", value:"recreate"},
        ],
        cleaningSpeedOption:[
          {name:"稳定优先", value:"steady"},
          {name:"速度适中", value:"balanced"},
          {name:"速度优先", value:"swift"},
        ],
        notifyPolicyOption:[
          {name:"不通知", value:"silence"},
          {name:"成功时通知", value:"success"},
          {name:"失败时通知", value:"failed"},
          {name:"成功或失败都通知", value:"always"},
        ],
        sourceList:[],
        destList:[],
      }
    },
    methods: {
      cancelAddSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogAddFormVisible = false;
      },
      onAddSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 30000);

          this.$http.post(api.POLICY_ADD, JSON.stringify(this.form)).then(res => {
            this.fullscreenLoading = false;
            this.dialogAddFormVisible = false;
            this.$refs[formName].resetFields();
            this.$notify({ title: '成功', message: "添加成功", type: 'success' });
            this.loadData();
          }).catch(()=>{
            this.fullscreenLoading = false;
          })
        })
      },
      addPolicy(){
        this.dialogAddFormVisible = true;
        sysApi.sourceList().then(res => {
          this.sourceList = res.data.items;
        });
      },
      handleSearch(){
        this.loadData();
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
          this.$http.delete(api.POLICY_LIST,{
            data: JSON.stringify({id: row.id}),
          }).then(res => {
            this.loadData();
            this.$notify({ title: '成功', message: "删除成功", type: 'success' });
          });
        }).catch(() => {
        });
      },
      loadData(){
        sysApi.policyList({
          [this.searchKey]: this.searchVal,
          pageSize: this.tableData.pagination.pageSize,
          page: this.tableData.pagination.pageNo
        }).then(res => {
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
</style>
