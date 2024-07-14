<template>
  <imp-panel>
    <h4 class="content-header" slot="header">
      <div class="content-header-all">
        <div>
          <el-button size="mini" type="primary" @click="addDest" icon="plus">新增</el-button>
        </div>
        <div class="content-header-right">
            <el-input size="mini" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" clearable>
              <el-select size="mini" class="input-with-select" v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in destSearchOption" :key="item.value" :label="item.name" :value="item.value" />
              </el-select>
              <el-button size="mini" slot="append" icon="el-icon-search" @click="handleSearch"/>
            </el-input>
            <el-button size="mini" icon="el-icon-refresh" @click="handleSearch" />
          </div>
      </div>
    </h4>
    <div slot="body">
      <el-dialog title="添加目标" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="目标名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item  label="说明"  label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="归档介质" prop="storage" label-width="80px">
            <el-select v-model="form.storage" @change="storageChange" filterable placeholder="归档介质" style="width: 100%;">
              <el-option
                v-for="item in storageOption" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接" prop="connection_id" label-width="80px">
            <el-select v-model="form.connection_id" filterable placeholder="请选择连接" style="width: 100%;">
              <el-option
                v-for="item in connectList" :key="item.id" :label="item.id + ' | ' +item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标库名" label-width="80px">
            <el-input v-model="form.database_name" placeholder="若不填默认和源库名保持一致" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="目标表名" prop="table_name" label-width="80px">
            <el-input v-model="form.table_name" placeholder="可指定名字，或引用源表如: {source_table}, {source_table}_{YYYY-MM}" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="压缩存储" label-width="80px">
            <el-switch v-model="form.compress" size="mini"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改源端信息" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="目标名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="说明" label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="归档介质" prop="storage" label-width="80px">
            <el-select v-model="form.storage" filterable disabled placeholder="归档介质" style="width: 100%;">
              <el-option
                v-for="item in storageOption" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="连接" prop="connection_id" label-width="80px">
            <el-select v-model="form.connection_id" disabled filterable placeholder="请选择连接" style="width: 100%;">
              <el-option
                v-for="item in connectList" :key="item.id" :label="item.id + ' | ' +item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标库名" label-width="80px">
            <el-input v-model="form.database_name" disabled placeholder="若不填默认和源库名保持一致" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="目标表名" prop="table_name" label-width="80px">
            <el-input v-model="form.table_name" disabled placeholder="可自定义名字，或引用源表及日期如: {source_table}, {source_table}_{YYYY-MM}" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="压缩存储" label-width="80px">
            <el-switch v-model="form.compress" disabled size="mini"/>
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
        style="width: 100%;"
        size="mini"
        stripe
        v-loading="listLoading">
        <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
        <el-table-column prop="name" label="目标端名称" align="center"  sortable> </el-table-column>
        <el-table-column prop="description" label="说明" align="center"  sortable> </el-table-column>
        <el-table-column prop="connection_id" label="连接ID"  align="center" sortable> </el-table-column>
        <el-table-column prop="storage" label="归档介质" align="center" sortable>
          <template slot-scope="scope">{{ getOptionName(storageOption, scope.row.storage) }}</template>
        </el-table-column>
        <el-table-column prop="database_name" label="目标库名" align="center" sortable></el-table-column>
        <el-table-column prop="table_name" label="目标表名" align="center" sortable></el-table-column>
        <el-table-column prop="compress" label="压缩存储" align="center" width="100px" sortable>
          <template slot-scope="scope">{{ scope.row.compress ? "是" : "否" }}</template>
        </el-table-column>
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button-group size="mini">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" style="color: red;"></el-button>
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
import panel from "../../components/panel.vue"
import * as sysApi from '../../services/sys'
import {destSearchOption, storageOption, getOptionName} from "../../common/utils";
import * as api from "../../api";

export default {
  components: {
      'imp-panel': panel
  },
  watch:{
    searchKey: function (newVal, oldVal){
      if (newVal !== oldVal) {
        window.localStorage.setItem("destSearchKey", newVal);
      }
    }
  },
  data(){
      return {
        storageOption,
        destSearchOption,
        searchKey: 'name',
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
        },
        form: {
          id: 0,
          name: "",
          description: "",
          storage: "mysql",
          connection_id: 0,
          database_name: "",
          table_name: "",
          compress: false,
        },
        connectList: [],
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          storage: [
            { required: true, message: '请选择归档介质', trigger: 'blur' }
          ],
          connection_id: [
            { required: true, message: '请选择连接', trigger: 'blur' }
          ],
          table_name: [
            { required: true, message: '请输入表名', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      getOptionName,
      storageChange(op){
        sysApi.connList({storage: op}).then(res => {
          this.connectList = res.data.items;
        });
      },
      addDest(){
        this.dialogAddFormVisible = true;
        this.form = {};
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageNo = 1;
        this.tableData.pagination.pageSize = val;
        this.loadData();
        window.localStorage.setItem("destPageSize", val)
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
        this.form.storage = row.storage;
        this.form.connection_id = row.connection_id;
        this.form.database_name = row.database_name;
        this.form.table_name = row.table_name;
        this.form.compress = row.compress;
      },
      handleDelete(index, row){
        this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.DEST_LIST,{
            data: JSON.stringify({id: row.id}),
          }).then(res => {
            this.loadData();
            this.$notify({ title: '成功', message: "删除成功", type: 'success' });
          });
        }).catch(() => {
        });
      },
      handleSearch(){
        this.loadData();
      },
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

          this.$http.post(api.DEST_LIST, JSON.stringify(this.form)).then(res => {
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

          this.$http.put(api.DEST_LIST, JSON.stringify(this.form)).then(res => {
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
      loadData(){
        let para = {
          [this.searchKey]: this.searchVal,
          pageSize: this.tableData.pagination.pageSize,
          page: this.tableData.pagination.pageNo
        }
        sysApi.getDestList(para).then(res => {
          this.tableData.rows = res.data.items;
          this.tableData.pagination.total = res.data.total;
        });
      }
    },
    created(){
      this.searchKey = window.localStorage.getItem("destSearchKey");
      this.searchKey = this.searchKey === null ? "id" : this.searchKey;

      const pageSize = parseInt(window.localStorage.getItem("destPageSize"), 10);
      this.tableData.pagination.pageSize = Number.isFinite(pageSize) ? pageSize : 10 ;

      this.loadData();
    }
  }
</script>
<style lang="css" scoped>
@import "../../../static/css/main.css";

</style>
