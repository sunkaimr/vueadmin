<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="12" style="display: flex; align-items: flex-end;">
            <el-button size="small" type="primary" @click="addSource" icon="plus">新增</el-button>
        </el-col>
        <el-col :span="12" style="display: flex; align-items: flex-end;">
          <div style="margin-top: 15px; margin-left: auto;">
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option label="ID" value="id"></el-option>
                <el-option label="源端名称" value="name"></el-option>
                <el-option label="BU" value="bu"></el-option>
                <el-option label="集群名称" value="cluster_name"></el-option>
                <el-option label="源库名" value="database_name"></el-option>
                <el-option label="源表名" value="table_name"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-dialog title="添加源" :visible.sync="dialogAddFormVisible" style="width: 100%;">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item class="el-form-item-label" label="源端名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item  label="说明"  label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="集群ID" prop="cluster_id" label-width="80px">
            <el-select v-model="form.cluster_id" @change="clusterChange" filterable placeholder="请选择集群" style="width: 100%;">
              <el-option
                v-for="item in clusterList" :key="item.cluster_id" :label="item.cluster_id + ' | ' +item.cluster_name" :value="item.cluster_id">
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
          <el-form-item label="源表名" prop="tables_name" label-width="80px">
            <div style="display: flex; align-items: center;">
              <el-input v-model="tableNameFilter" @blur="handleTableNameFilter" @clear="handleTableNameFilter" style="flex: 1; margin-right: 10px;" clearable placeholder="使用正则表达式筛选所需表名"/>
            </div>
            <div style="display: flex; margin-top: 10px; align-items: center;">
            <el-select v-model="form.tables_name" multiple style="flex: 1; max-height: 80px; overflow-y: auto; margin-right: 10px;" clearable>
              <el-option
                v-for="item in filteredTableList" :key="item" :label="item" :value="item">
              </el-option>
            </el-select>
              <el-button size="mini" @click="selectAllFilter">全选</el-button>
              <el-button size="mini" @click="clearSelected">清空</el-button>
            </div>
          </el-form-item>
          <el-form-item label="列名" label-width="80px">
            <el-input v-model="form.columns" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <div slot="body">
        <el-dialog title="修改源端信息" :visible.sync="dialogEditFormVisible" style="width: 100%;">
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item class="el-form-item-label" label="源端名称" prop="name" label-width="80px">
              <el-input v-model="form.name" autocomplete="off" clearable/>
            </el-form-item>
            <el-form-item  label="说明"  label-width="80px">
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
            <el-form-item label="列名" label-width="80px">
              <el-input v-model="form.columns" disabled></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelEditSubmit('form')">取 消</el-button>
            <el-button type="primary" @click="onEditSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%"
        size="small"
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
        <el-table-column prop="name" label="源端名称" sortable> </el-table-column>
        <el-table-column prop="bu" label="BU" sortable> </el-table-column>
        <el-table-column prop="cluster_name" width="200px" label="集群名称" sortable> </el-table-column>
        <el-table-column prop="cluster_id" label="集群ID" sortable> </el-table-column>
        <el-table-column prop="database_name" label="源库名" sortable> </el-table-column>
        <el-table-column prop="tables_name" label="源表名" sortable>
          <template slot-scope="scope">
            <div class="cell-ellipsis">{{ scope.row.tables_name }}</div>
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
  import * as sysApi from '../services/sys'

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      return {
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
          name: [
            { required: true, message: '请输入源端名称', trigger: 'blur' },
          ],
          cluster_id: [
            { required: true, message: '请选择集群', trigger: 'blur' }
          ],
          database_name: [
            { required: true, message: '请选择源库名', trigger: 'blur' }
          ],
          tables_name: [
            { required: true, message: '请选择源表名', trigger: 'blur' }
          ]
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
        // this.filteredTableList = this.tableList.filter(item => item.includes(this.tableNameFilter));
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
        sysApi.mysqlClusterList().then(res => {
          this.clusterList = res.data;
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
        sysApi.mysqlDatabaseList(clusterID).then(res => {
          this.databaseList = res.data;
        });
      },
      databaseChange(database){
        sysApi.mysqlTableList(this.selectedClusterId, database).then(res => {
          this.tableList = res.data;
          this.filteredTableList = this.tableList;
          this.form.tables_name = [];
        });
      },
      selectAllFilter(){
        this.form.tables_name = this.filteredTableList
        this.$notify({ title: '提示', message: "已选择 "+this.form.tables_name.length+" 张表", type: 'info' });
      },
      clearSelected(){
        this.form.tables_name = [];
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
      handleSelectionChange(val){
        this.tableData.pagination.pageSize = val;
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
      this.loadData();
    }
  }
</script>
<style>
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    width: 120px;
  }
  .el-table .cell-ellipsis {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-pagination {
    float: right;
    margin-top: 15px;
  }
  .table-expand .el-form-item {
    margin-right: 40px;
    margin-left: 40px;
    margin-bottom: 0;
    width: 45%;
  }
  .table-expand, .table-expand * {
    font-size: 12px;
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
    word-break: break-all; /* 允许在任意位置换行 */
  }
</style>
