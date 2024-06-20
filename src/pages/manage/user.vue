<template>
  <imp-panel>
    <h4 class="box-title" slot="header" style="width: 100%;">
      <el-row style="width: 100%; display: flex; align-items: flex-end;">
        <el-col :span="8" style="display: flex; align-items: flex-end;">
          <el-button size="small" type="primary" @click="addUser" icon="plus">添加用户</el-button>
        </el-col>
        <el-col :span="24" style="display: flex; align-items: flex-end;">
          <div style="display: flex; margin-left: auto; ustify-items: center; align-items: center;">
            <el-input size="small" placeholder="请输入内容" v-model="searchVal" @clear="handleSearch" @keyup.enter.native="handleSearch" class="input-with-select" clearable>
              <el-select v-model="searchKey" slot="prepend" placeholder="请选择">
                <el-option v-for="item in userSearchOption" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
              <el-button size="small" slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            </el-input>
            <el-button size="small" icon="el-icon-refresh" @click="handleSearch" style="margin-left: 10px;"/>
          </div>
        </el-col>
      </el-row>
    </h4>
    <div slot="body">
      <el-dialog title="添加用户" :visible.sync="dialogAddFormVisible" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="用户名" prop="username" label-width="80px">
            <el-input v-model="form.username" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="姓名" prop="real_name" label-width="80px">
            <el-input v-model="form.real_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" label-width="80px">
            <el-input v-model="form.email" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="80px">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm" label-width="80px">
            <el-input v-model="form.passwordConfirm" placeholder="请确认密码" show-password></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onAddSubmit('form')" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="dialogEditFormVisible" style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="用户名" prop="username" label-width="80px">
            <el-input v-model="form.username" disabled autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="姓名" prop="real_name" label-width="80px">
            <el-input v-model="form.real_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px">
            <el-input v-model="form.email" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="密码" label-width="80px">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <template v-if="form.password !== ''">
            <el-form-item label="确认密码" label-width="80px">
              <el-input v-model="form.passwordConfirm" placeholder="请确认密码" show-password></el-input>
            </el-form-item>
          </template>
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
        v-loading="listLoading"
        @selection-change="handleSelectionChange">
        <el-table-column prop="id" label="ID" width="100px" align="center" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" align="center" sortable> </el-table-column>
        <el-table-column prop="real_name" label="姓名" align="center" sortable> </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" sortable></el-table-column>
        <el-table-column prop="is_ldap" label="账户类型" align="center" sortable>
          <template slot-scope="scope">{{scope.row.is_ldap ? "域账号" : "本地账号" }}</template>
        </el-table-column>
        <el-table-column prop="last_login" label="上次登陆" width="240px" align="center" sortable>
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
  import panel from "../../components/panel.vue"
  import * as api from "../../api"
  import * as sysApi from '../../services/sys'
  import {userSearchOption} from "../../common/utils";

  export default {
    components: {
      'imp-panel': panel
    },
    data(){
      const validatePassword = (rule, value, callback) => {
        if (value !== this.form.passwordConfirm) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      const validatePasswordConfirm = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        searchKey: 'username',
        searchVal: '',
        dialogEditFormVisible: false,
        dialogAddFormVisible: false,
        fullscreenLoading: false,
        listLoading: false,
        userSearchOption,
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
          username: "",
          real_name: "",
          email: "",
          password: "",
          passwordConfirm: "",
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          real_name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwordConfirm: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { validator: validatePasswordConfirm, trigger: 'blur' }
          ]
        },
      }
    },
    methods: {
      onAddSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          }
          this.fullscreenLoading = true;
          setTimeout(() => {
            this.fullscreenLoading = false;
          }, 30000);

          const para = {
            username: this.form.username,
            real_name: this.form.real_name,
            email: this.form.email,
            password: this.form.password,
            is_ldap: 0,
          }
          this.$http.post(api.SYS_USER_REGISTER, JSON.stringify(para)).then(res => {
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
          }, 1000);

          if (this.form.password !== "" && this.form.password !== this.form.passwordConfirm){
            this.$notify({ title: '失败', message: "两次输入密码不一致", type: 'error' });
            this.fullscreenLoading = false;
            return
          }

          const para = {
            username : this.form.username,
            real_name: this.form.real_name,
            email: this.form.email,
            password: this.form.password,
          }
          this.$http.put(api.USER_UPDATE, JSON.stringify(para)).then(res => {
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
      cancelAddSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogAddFormVisible = false;
      },
      cancelEditSubmit(formName){
        this.$refs[formName].resetFields();
        this.fullscreenLoading = false;
        this.dialogEditFormVisible = false;
      },
      addUser(){
        this.dialogAddFormVisible = true;
        this.form = {};
      },
      handleSearch(){
        this.loadData();
      },
      handleSelectionChange(){
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
        this.dialogEditFormVisible = true;
        this.form.id = row.id;
        this.form.username = row.username;
        this.form.real_name = row.real_name;
        this.form.email = row.email;
        this.form.is_ldap = row.is_ldap;
      },

      handleDelete(index, row){
        this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const url = api.SYS_USER_DELETE.replace('{user}', row.username);
          this.$http.delete(url).then(res => {
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
        sysApi.userList(para).then(res => {
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
