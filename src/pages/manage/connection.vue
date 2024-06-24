<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="8" style="display: flex; align-items: flex-end;">
          <el-button size="small" type="primary" @click="addConn" icon="plus">新增</el-button>
        </el-col>
        <el-col :span="16" style="display: flex; align-items: flex-end;">
          <div style="display: flex; margin-left: auto; ustify-items: center; align-items: center;">
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in connSearchOption" :key="item.value" :label="item.name" :value="item.value" style="font-size: 12px"></el-option>
              </el-select>
              <el-button size="small" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
            <el-button size="small" icon="el-icon-refresh" @click="handleSearch" style="margin-left: 10px;"/>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-dialog title="添加连接" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="目标名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item  label="说明"  label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item  label="BU" prop="bu" label-width="80px">
            <el-input v-model="form.bu" clearable/>
          </el-form-item>
          <el-form-item label="归档介质" prop="storage" label-width="80px">
            <el-select v-model="form.storage" filterable placeholder="归档介质" style="width: 100%;">
              <el-option
                v-for="item in storageOption" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.storage === 'mysql'">
            <el-form-item label="Host" prop="mysql_host"  label-width="80px">
              <el-input v-model="form.mysql_host" placeholder="mysql的域名或IP" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Port" prop="mysql_port" label-width="80px">
              <el-input v-model="form.mysql_port" placeholder="mysql的端口" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="mysql_user" label-width="80px">
              <el-input v-model="form.mysql_user" placeholder="用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="mysql_passwd" label-width="80px">
              <el-input type="password" v-model="form.mysql_passwd" placeholder="密码" autocomplete="off"></el-input>
            </el-form-item>
          </template>
          <template v-if="form.storage === 'databend'">
            <el-form-item label="地址" prop="data_bend_addr" label-width="80px">
              <el-input v-model="form.data_bend_addr" placeholder="DataBend地址" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="AK" prop="data_bend_ak" label-width="80px">
              <el-input v-model="form.data_bend_ak" placeholder="DataBend的AK" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="SK" prop="data_bend_ak" label-width="80px">
              <el-input v-model="form.data_bend_sk" placeholder="DataBend的SK" autocomplete="off"></el-input>
            </el-form-item>
          </template >
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改连接息" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="目标名称" prop="name" label-width="80px">
            <el-input v-model="form.name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item  label="说明"  label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item  label="BU" prop="bu" label-width="80px">
            <el-input v-model="form.bu" clearable/>
          </el-form-item>
          <el-form-item label="归档介质" prop="storage" label-width="80px">
            <el-select v-model="form.storage" disabled filterable placeholder="归档介质" style="width: 100%;">
              <el-option
                v-for="item in storageOption" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.storage === 'mysql'">
            <el-form-item label="Host" prop="mysql_host"  label-width="80px">
              <el-input v-model="form.mysql_host" placeholder="mysql的域名或IP" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Port" prop="mysql_port" label-width="80px">
              <el-input v-model="form.mysql_port" placeholder="mysql的端口" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户" prop="mysql_user" label-width="80px">
              <el-input v-model="form.mysql_user" placeholder="用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="mysql_passwd" label-width="80px">
              <el-input type="password" v-model="form.mysql_passwd" placeholder="密码" autocomplete="off"></el-input>
            </el-form-item>
          </template>
          <template v-if="form.storage === 'databend'">
            <el-form-item label="地址" prop="data_bend_addr" label-width="80px">
              <el-input v-model="form.data_bend_addr" placeholder="DataBend地址" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="AK" label-width="80px">
              <el-input v-model="form.data_bend_ak" placeholder="DataBend的AK" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="SK" label-width="80px">
              <el-input v-model="form.data_bend_sk" placeholder="DataBend的SK" autocomplete="off"></el-input>
            </el-form-item>
          </template >
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onEditSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-tabs v-model="tablePaneName" type="card" @tab-click="handleTablePaneChane">
        <el-tab-pane label="MySQL" name="mysql">
          <template v-if="tablePaneName === 'mysql'">
            <el-table
              :data="tableData.rows"
              border
              style="width: 100%;"
              size="mini"
              stripe
              v-loading="listLoading">
              <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
              <el-table-column prop="name" label="连接名称" align="center"  sortable> </el-table-column>
              <el-table-column prop="description" label="说明" align="center"  sortable> </el-table-column>
              <el-table-column prop="bu" label="BU"  align="center" sortable> </el-table-column>
              <el-table-column prop="storage" label="归档介质" align="center" sortable>
                <template slot-scope="scope">{{ getOptionName(storageOption, scope.row.storage) }}</template>
              </el-table-column>
              <el-table-column prop="mysql_host" label="地址" align="center" sortable></el-table-column>
              <el-table-column prop="mysql_port" label="端口" align="center" sortable></el-table-column>
              <el-table-column prop="mysql_user" label="用户名" align="center" sortable></el-table-column>
              <el-table-column label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <el-button-group size="mini">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
                    <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" style="color: red;"></el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
        <el-tab-pane label="DataBend" name="databend">
          <template v-if="tablePaneName === 'databend'">
            <el-table
              :data="tableData.rows"
              border
              style="width: 100%;"
              size="mini"
              stripe
              v-loading="listLoading">
              <el-table-column prop="id" label="ID" width="80px" align="center" sortable> </el-table-column>
              <el-table-column prop="name" label="连接名称" align="center"  sortable> </el-table-column>
              <el-table-column prop="description" label="说明" align="center"  sortable> </el-table-column>
              <el-table-column prop="bu" label="BU"  align="center" sortable> </el-table-column>
              <el-table-column prop="storage" label="归档介质" align="center" sortable>
                <template slot-scope="scope">{{ getOptionName(storageOption, scope.row.storage) }}</template>
              </el-table-column>
              <el-table-column prop="data_bend_addr" label="DataBend地址" align="center" sortable></el-table-column>
              <el-table-column prop="data_bend_ak" label="AK" align="center" sortable></el-table-column>
              <el-table-column prop="data_bend_sk" label="SK" align="center" sortable></el-table-column>
              <el-table-column label="操作" width="110" align="center">
                <template slot-scope="scope">
                  <el-button-group size="mini">
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"/>
                    <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" style="color: red;"/>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
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
  import {connSearchOption, getOptionName, storageOption} from "../../common/utils";
  import * as api from "../../api";

  export default {
    components: {
      'imp-panel': panel
    },
    watch:{
      searchKey: function (newVal, oldVal){
        if (newVal !== oldVal) {
          window.localStorage.setItem("connSearchKey", newVal);
        }
      },
      tablePaneName: function (newVal, oldVal){
        if (newVal !== oldVal) {
          window.localStorage.setItem("connTablePaneName", newVal);
        }
      }
    },
    data(){
      return {
        tablePaneName: "mysql",
        storageOption,
        connSearchOption,
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
        form :{
          name: "",
          description:"",
          bu:"",
          storage:"",
          data_bend_ak:"",
          data_bend_sk:"",
          data_bend_addr:"",
          mysql_host:"",
          mysql_port:"",
          mysql_user:"",
          mysql_passwd:"",
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          bu: [
            { required: true, message: '请输入连接信息所属bu', trigger: 'blur' },
          ],
          storage: [
            { required: true, message: '请选择归档介质', trigger: 'blur' }
          ],
          mysql_host: [
            { required: true, message: '请填写host', trigger: 'blur' }
          ],
          mysql_port: [
            { required: true, message: '请填写port', trigger: 'blur' }
          ],
          mysql_user: [
            { required: true, message: '请填写用户', trigger: 'blur' }
          ],
          data_bend_addr: [
            { required: true, message: '请填写地址', trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      getOptionName,
      handleSearch(){
        this.loadData();
      },
      handleTablePaneChane(){
        this.tableData.rows=[];
        this.loadData();
      },
      handleSizeChange(val) {
        this.tableData.pagination.pageSize = val;
        this.loadData();
        window.localStorage.setItem("connPageSize", val)
      },
      handleCurrentChange(val) {
        this.tableData.pagination.pageNo = val;
        this.loadData();
      },
      handleEdit(index, row){
        this.dialogEditFormVisible = true;
        this.form.id = row.id;
        this.form.name = row.name;
        this.form.bu = row.bu;
        this.form.description = row.description;
        this.form.storage = row.storage;
        this.form.data_bend_ak = row.data_bend_ak;
        this.form.data_bend_sk = row.data_bend_sk;
        this.form.data_bend_addr = row.data_bend_addr;
        this.form.mysql_host = row.mysql_host;
        this.form.mysql_port = row.mysql_port;
        this.form.mysql_user = row.mysql_user;
        this.form.mysql_passwd = row.mysql_passwd;
      },
      handleDelete(index, row){
        this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(api.CONN_LIST_GET,{
            data: JSON.stringify({id: row.id}),
          }).then(res => {
            this.loadData();
            this.$notify({ title: '成功', message: "删除成功", type: 'success' });
          });
        }).catch(() => {
        });
      },
      addConn(){
        this.dialogAddFormVisible = true;
        this.form = { storage: "mysql" };
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

          this.$http.post(api.CONN_LIST_GET, JSON.stringify(this.form)).then(res => {
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

          this.$http.put(api.CONN_LIST_GET, JSON.stringify(this.form)).then(res => {
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
          storage: this.tablePaneName,
          pageSize: this.tableData.pagination.pageSize,
          page: this.tableData.pagination.pageNo
        }
        sysApi.connList(para).then(res => {
          this.tableData.rows = res.data.items;
          this.tableData.pagination.total = res.data.total;
        });
      }
    },
    created(){
      this.searchKey = window.localStorage.getItem("connSearchKey");
      this.searchKey = this.searchKey === null ? "id" : this.searchKey;

      this.tablePaneName = window.localStorage.getItem("connTablePaneName");
      this.tablePaneName = this.tablePaneName === null ? "mysql" : this.tablePaneName;

      const pageSize = parseInt(window.localStorage.getItem("connPageSize"), 10);
      this.tableData.pagination.pageSize = Number.isFinite(pageSize) ? pageSize : 10 ;

      this.loadData();
    }
  }
</script>
<style>
.input-with-select .el-input-group__prepend {
  background-color: #fff;
  width: 120px;
  font-size: 12px;
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
