<template>
  <imp-panel>
    <h4 class="content-header" slot="header">
      <div class="content-header-all">
        <div>
          <el-button size="mini" type="primary" @click="addSource" icon="plus">新增</el-button>
        </div>
        <div class="content-header-right">
          <el-input size="mini" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" clearable>
            <el-select class="input-with-select" v-model="searchKey" slot="prepend"  placeholder="请选择">
              <el-option v-for="item in sourceSearchOption" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
            <el-button size="mini" slot="append" icon="el-icon-search" @click="handleSearch"/>
          </el-input>
          <el-button size="mini" icon="el-icon-refresh" @click="handleSearch"/>
        </div>
      </div>
    </h4>
    <div slot="body" style="min-height: 400px;">
      <el-dialog title="添加源" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
<!--          <el-form-item label="源端名称" prop="name" label-width="80px">-->
<!--            <el-input v-model="form.name" autocomplete="off" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item  label="说明"  label-width="80px">-->
<!--            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>-->
<!--          </el-form-item>-->
          <el-form-item label="集群ID" prop="cluster_id" label-width="80px">
            <el-select v-model="form.cluster_id" @change="clusterChange" filterable placeholder="请选择集群" style="width: 100%;">
              <el-option
                v-for="item in clusterList" :key="item.cluster_id" :label="item.cluster_id + ' | ' + item.cluster_name" :value="item.cluster_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源库名" prop="database_name" label-width="80px">
            <el-select v-model="form.database_name" @change="databaseChange" filterable placeholder="请选择库名" style="width: 100%;">
              <el-option
                v-for="item in databaseList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="源表名" label-width="80px">
            <div style="display: flex; align-items: center;">
              <el-input v-model="tableNameFilter" @blur="handleTableNameFilter" @clear="handleTableNameFilter" style="flex: 1;" clearable placeholder="使用正则表达式筛选所需表名"/>
            </div>
            <div style="display: flex; margin-top: 10px; align-items: center;">
              <el-select v-model="form.tables_name" @visible-change="tablesNameChanged" multiple collapse-tags clearable style="flex: 1; margin-right: 10px;">
                <el-option
                  v-for="item in filteredTableList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-button size="mini" @click="selectAllFilter">全选</el-button>
              <el-button size="mini" @click="clearSelected">清空</el-button>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改源端信息" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" style="width: 100%;">
          <el-form size="mini" :model="form" :rules="rules" ref="form">
            <el-form-item label="源端名称" prop="name" label-width="80px">
              <el-input v-model="form.name" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item  label="说明" label-width="80px">
              <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
            </el-form-item>
            <el-form-item label="集群ID" label-width="80px">
              <el-input v-model="form.cluster_name" disabled clearable/>
            </el-form-item>
            <el-form-item label="源库名" label-width="80px">
              <el-input v-model="form.database_name" disabled clearable/>
            </el-form-item>
            <el-form-item label="源表名" label-width="80px">
              <el-input v-model="form.tables_name" disabled clearable/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
            <el-button size="mini" type="primary" @click="onEditSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
          </div>
        </el-dialog>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        size="small"
        stripe
        v-loading="listLoading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-descriptions
              border
              size="mini"
              class="table-expand"
              :column=2
              :labelStyle="tableExpandLabelStyle"
              :contentStyle="tableExpandContentStyle"
              with="100%" >
                <el-descriptions-item label="ID">{{ props.row.id }}</el-descriptions-item>
                <el-descriptions-item label="源端名称">{{ props.row.name }}</el-descriptions-item>
                <el-descriptions-item label="创建人"> {{ props.row.creator }} </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ props.row.created_at }}</el-descriptions-item>
                <el-descriptions-item label="说明">{{ props.row.description }}</el-descriptions-item>
                <el-descriptions-item label="BU">{{ props.row.bu }}</el-descriptions-item>
                <el-descriptions-item label="集群ID">{{ props.row.cluster_id }}</el-descriptions-item>
                <el-descriptions-item label="集群名称">{{ props.row.cluster_name }}</el-descriptions-item>
                <el-descriptions-item label="源库名">{{ props.row.database_name }}</el-descriptions-item>
                <el-descriptions-item label="源表名">{{ props.row.tables_name }}</el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
        <el-table-column prop="name" label="源端名称" sortable>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.name" :open-delay="500" placement="top">
              <div class="cell-ellipsis">{{ scope.row.name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="bu" label="BU" width="120px" sortable></el-table-column>
        <el-table-column prop="cluster_name" label="集群名称" sortable>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.cluster_name" :open-delay="500" placement="top">
              <div class="cell-ellipsis">{{ scope.row.cluster_name }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="database_name" label="源库名" sortable> </el-table-column>
        <el-table-column prop="tables_name" label="源表名" sortable>
          <template slot-scope="scope">
            <div class="cell-ellipsis">{{ scope.row.tables_name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button-group size="mini">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"/>
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" style="color: red;"/>
            </el-button-group>
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
  import {sourceSearchOption,tableExpandLabelStyle,tableExpandContentStyle} from '../common/utils'

  export default {
    components: {
      'imp-panel': panel
    },
    watch:{
      searchKey: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          window.localStorage.setItem("sourceSearchKey", newVal);
        }
      },
    },
    data(){
      return {
        tableExpandLabelStyle,
        tableExpandContentStyle,
        sourceSearchOption,
        dialogEditFormVisible: false,
        dialogAddFormVisible: false,
        fullscreenLoading: false,
        form:{
          name: "",
          description: "",
          bu: "",
          cluster_name: "",
          cluster_id: "",
          database_name: "",
          tables_name: "",
          columns: "",
        },
        rules: {
          // name: [
          //   { required: true, message: '请输入源端名称', trigger: 'blur' },
          // ],
          cluster_id: [
            { required: true, message: '请选择集群', trigger: 'blur' }
          ],
          database_name: [
            { required: true, message: '请选择源库名', trigger: 'blur' }
          ],
        },
        currentRow: {},
        dialogVisible: false,
        dialogLoading: false,
        defaultProps: {
          children: 'children',
          label: 'name',
          id: "id",
        },
        roleTree: [],
        listLoading: false,
        searchKey: 'id',
        searchVal: '',
        tableData: {
          pagination: {
            total: 0,
            pageNo: 1,
            pageSize: 10,
            parentId: 0
          },
          rows: []
        },
        clusterList:[],
        databaseList:[],
        tableList:[],
        selectedClusterId:"",
        tableNameFilter:"",
        filteredTableList: [],
        tableButName: "全选",
      }
    },
    methods: {
      handleTableNameFilter(){
        let pattern = this.tableNameFilter.replace(/\*/g, '.*');
        let regex = new RegExp(pattern, 'i');
        this.filteredTableList = this.tableList.filter(item => regex.test(item));
        this.form.tables_name = [];
      },
      addSource(){
        this.dialogAddFormVisible = true;
        this.databaseList = [];
        this.tableList = [];
        this.selectedClusterId = "";
        this.tableNameFilter = "";
        this.filteredTableList = [];
        this.form = {};
        sysApi.clusterList({
          pageSize: 10000,
        }).then(res => {
          this.clusterList = res.data.items;
        });

      },
      handleEdit(index, row){
        this.dialogEditFormVisible = true;
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.cluster_name = row.cluster_name;
        this.form.database_name = row.database_name;
        this.form.tables_name = row.tables_name;
        this.form.columns = row.columns;
      },
      clusterChange(clusterID){
        this.selectedClusterId = clusterID;
        sysApi.clusterDatabaseList(clusterID).then(res => {
          this.databaseList = res.data;
        });
      },
      databaseChange(database){
        sysApi.clusterTableList(this.selectedClusterId, database).then(res => {
          this.tableList = res.data;
          this.filteredTableList = this.tableList;
          this.form.tables_name = [];
        });
      },
      tablesNameChanged(visible){
        if ( !visible && this.form.tables_name.length !== 0 ){
          this.$notify({ title: '提示', message: "已选择 "+this.form.tables_name.length+" 张表", type: 'info' });
        }
      },
      selectAllFilter(){
        this.form.tables_name = this.filteredTableList
        this.$notify({ title: '提示', message: "已选择 "+this.form.tables_name.length+" 张表", type: 'info' });
      },
      clearSelected(){
        this.form.tables_name = [];
        this.$notify({ title: '提示', message: "已选择 "+this.form.tables_name.length+" 张表", type: 'info' });
      },
      onAddSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }

          if (this.form.tables_name.length === 0){
            this.$notify({ title: '错误', message: "请选择表名", type: 'error' });
            return
          }

          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 30000);

          let para = JSON.parse(JSON.stringify(this.form));
          para.tables_name = para.tables_name.join(',');
          this.$http.post(api.SOURCE_ADD, JSON.stringify(para)).then(res => {
            this.fullscreenLoading = false;
            this.dialogAddFormVisible = false;
            this.$refs[formName].resetFields();
            this.$notify({ title: '成功', message: "添加成功", type: 'success' });
            this.loadData();
          }).catch(()=>{
            this.fullscreenLoading = false;
          })
        });
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
          }
          this.$http.put(api.SOURCE_ADD, JSON.stringify(para)).then(res => {
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
      cancelEditSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogEditFormVisible = false;
      },
      cancelAddSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogAddFormVisible = false;
      },
      handleSearch(){
        this.loadData();
      },
      handleSizeChange(val) {
        window.localStorage.setItem("sourcePageSize", val);
        this.tableData.pagination.pageNo = 1;
        this.tableData.pagination.pageSize = val;
        this.loadData();
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleDelete(index, row){
        this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.SOURCE_LIST,{
            data: JSON.stringify({id: row.id}),
          }).then(res => {
            this.loadData();
            this.$notify({ title: '成功', message: "删除成功", type: 'success' });
          });
        }).catch(() => {
        });
      },
      loadData(){
          sysApi.sourceList({
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
      this.searchKey = window.localStorage.getItem("sourceSearchKey");
      const pageSize = parseInt(window.localStorage.getItem("sourcePageSize"), 10);
      this.tableData.pagination.pageSize = Number.isFinite(pageSize) ? pageSize : 10 ;
      this.searchKey = this.searchKey === null ? "id" : this.searchKey;
      this.loadData();
    }
  }
</script>

<style lang="css" scoped>
@import "../../static/css/main.css";

</style>
