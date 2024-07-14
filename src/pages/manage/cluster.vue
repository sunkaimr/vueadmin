<template>
  <imp-panel>
    <h4 class="content-header" slot="header">
      <div class="content-header-all">
        <div class="content-header-left">
          <el-button size="mini" type="primary" @click="addCluster" icon="plus">新增</el-button>
          <el-button size="mini" @click="handleSyncCluster">同步</el-button>
        </div>
        <div class="content-header-right">
          <el-input
            size="mini"
            placeholder="请输入内容"
            v-model="searchVal"
            @clear="handleSearch"
            @keyup.enter.native="handleSearch"
            clearable>
            <el-select class="input-with-select" v-model="searchKey" slot="prepend" placeholder="请选择">
              <el-option v-for="item in clusterSearchOption" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
            <el-button size="mini" slot="append" icon="el-icon-search" @click="handleSearch"/>
          </el-input>
          <el-button size="mini" icon="el-icon-refresh" @click="handleSearch"/>
        </div>
      </div>
    </h4>
    <div slot="body">
      <el-dialog title="添加集群" :visible.sync="dialogAddFormVisible" :close-on-click-modal="false"
                 style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="集群名称" prop="cluster_name" label-width="80px">
            <el-input v-model="form.cluster_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="集群ID" prop="cluster_id" label-width="80px">
            <el-input v-model="form.cluster_id" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="说明" label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="BU" prop="bu" label-width="80px">
            <el-input v-model="form.bu" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="环境" prop="env" label-width="80px">
            <el-select v-model="form.env" placeholder="请选择" style="width: 100%;">
              <el-option v-for="i in envNameMap" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集群类型" prop="cluster_type" label-width="80px">
            <el-input v-model="form.cluster_type" disabled autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="服务地址" prop="service_addr" label-width="80px">
            <el-input v-model="form.service_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="读写地址" prop="write_addr" label-width="80px">
            <el-input v-model="form.write_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="只读地址" prop="read_addr" label-width="80px">
            <el-input v-model="form.read_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="用户名" prop="user_name" label-width="80px">
            <el-input v-model="form.user_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="80px">
            <el-input type="password" v-model="form.password" autocomplete="off" clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelAddSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onAddSubmit('form')"
                     v-loading.fullscreen.lock="fullscreenLoading">确 定
          </el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改集群信息" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false"
                 style="width: 100%;">
        <el-form size="mini" :model="form" :rules="rules" ref="form">
          <el-form-item label="集群名称" prop="cluster_name" label-width="80px">
            <el-input v-model="form.cluster_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="集群ID" prop="cluster_id" label-width="80px">
            <el-input v-model="form.cluster_id" disabled autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="说明" label-width="80px">
            <el-input type="textarea" :rows="2" v-model="form.description" clearable/>
          </el-form-item>
          <el-form-item label="BU" prop="bu" label-width="80px">
            <el-input v-model="form.bu" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="环境" prop="env" label-width="80px">
            <el-select v-model="form.env" placeholder="请选择" style="width: 100%;">
              <el-option v-for="i in envNameMap" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="集群类型" prop="cluster_type" label-width="80px">
            <el-input v-model="form.cluster_type" disabled autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="服务地址" prop="service_addr" label-width="80px">
            <el-input v-model="form.service_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="读写地址" prop="write_addr" label-width="80px">
            <el-input v-model="form.write_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="只读地址" prop="read_addr" label-width="80px">
            <el-input v-model="form.read_addr" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="用户名" prop="user_name" label-width="80px">
            <el-input v-model="form.user_name" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="密码" prop="password" label-width="80px">
            <el-input type="password" v-model="form.password" autocomplete="off" clearable/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelEditSubmit('form')">取 消</el-button>
          <el-button size="mini" type="primary" @click="onEditSubmit('form')"
                     v-loading.fullscreen.lock="fullscreenLoading">确 定
          </el-button>
        </div>
      </el-dialog>
      <el-table
        :data="tableData.rows"
        border
        style="width: 100%;"
        size="mini"
        stripe
        v-loading="listLoading">
        <el-table-column prop="id" label="ID" width="80px" align="center" sortable></el-table-column>
        <el-table-column prop="cluster_name" label="集群名称" align="center" min-width="150px"
                         sortable></el-table-column>
        <el-table-column prop="cluster_id" label="集群ID" align="center" sortable></el-table-column>
        <el-table-column prop="description" label="说明" align="center" sortable></el-table-column>
        <!--        <el-table-column prop="bu" label="BU"  align="center" sortable> </el-table-column>-->
        <el-table-column prop="env" label="环境" align="center" width="80px" sortable>
          <template slot-scope="scope">{{ getOptionName(envNameMap, scope.row.env) }}</template>
        </el-table-column>
        <el-table-column prop="import_from" label="添加方式" align="center" sortable>
          <template slot-scope="scope">{{ getOptionName(importFromNameMap, scope.row.import_from) }}</template>
        </el-table-column>
        <!--        <el-table-column prop="cluster_type" label="集群类型" align="center" width="100px" sortable></el-table-column>-->
        <el-table-column prop="service_addr" label="服务地址" align="center" min-width="150px"
                         sortable></el-table-column>
        <!--        <el-table-column prop="write_addr" label="读写地址" align="center" sortable></el-table-column>-->
        <!--        <el-table-column prop="read_addr" label="只读地址" align="center" sortable></el-table-column>-->
        <el-table-column label="操作" width="110" align="center">
          <template slot-scope="scope">
            <el-button-group size="mini">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"
                         style="color: red;"></el-button>
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
import {getOptionName, envNameMap, clusterSearchOption, importFromNameMap} from "../../common/utils";
import * as api from "../../api";
import {CLUSTER_SYNC} from "../../api";

export default {
  components: {
    'imp-panel': panel
  },
  watch: {
    searchKey: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        window.localStorage.setItem("clusterSearchKey", newVal);
      }
    }
  },
  data() {
    return {
      envNameMap,
      importFromNameMap,
      clusterSearchOption,
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
      },
      form: {
        id: 0,
        "cluster_id": "",
        "cluster_name": "",
        "description": "",
        "bu": "",
        "env": "",
        "import_from": "",
        "cluster_type": "",
        "service_addr": "",
        "write_addr": "",
        "read_addr": "",
        "user_name": "",
        "password": ""
      },
      connectList: [],
      rules: {
        cluster_name: [
          {required: true, message: '请输入集群名称', trigger: 'blur'},
        ],
        cluster_id: [
          {required: true, message: '请输入集群ID', trigger: 'blur'},
        ],
        env: [
          {required: true, message: '请选择环境', trigger: 'blur'},
        ],
        service_addr: [
          {required: true, message: '请输入服务地址: ip:port ', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    getOptionName,
    addCluster() {
      this.dialogAddFormVisible = true;
      this.form = {cluster_type: "mysql"};
    },
    handleSyncCluster() {
      this.fullscreenLoading = true;

      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 5000);

      this.$http.get(api.CLUSTER_SYNC).then(res => {
        this.loadData();
        this.$notify({title: '成功', message: "同步完成", type: 'success'});
        this.fullscreenLoading = false;
      });
    },
    handleSizeChange(val) {
      this.tableData.pagination.pageNo = 1;
      this.tableData.pagination.pageSize = val;
      this.loadData();
      window.localStorage.setItem("clusterPageSize", val)
    },
    handleCurrentChange(val) {
      this.tableData.pagination.pageNo = val;
      this.loadData();
    },
    handleEdit(index, row) {
      this.dialogEditFormVisible = true;
      this.form.id = row.id;
      this.form.cluster_name = row.cluster_name;
      this.form.cluster_id = row.cluster_id;
      this.form.description = row.description;
      this.form.env = row.env;
      this.form.bu = row.bu;
      this.form.cluster_type = row.cluster_type;
      this.form.service_addr = row.service_addr;
      this.form.write_addr = row.write_addr;
      this.form.read_addr = row.read_addr;
      this.form.user_name = row.user_name;
      this.form.password = row.password;
    },
    handleDelete(index, row) {
      this.$confirm('确定要执行删除操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(api.CLUSTER, {
          data: JSON.stringify({id: row.id}),
        }).then(res => {
          this.loadData();
          this.$notify({title: '成功', message: "删除成功", type: 'success'});
        });
      }).catch(() => {
      });
    },
    handleSearch() {
      this.loadData();
    },
    cancelAddSubmit(formName) {
      this.$refs[formName].resetFields();
      this.fullscreenLoading = false;
      this.dialogAddFormVisible = false;
    },
    onAddSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 30000);

        this.$http.post(api.CLUSTER, JSON.stringify(this.form)).then(res => {
          this.fullscreenLoading = false;
          this.dialogAddFormVisible = false;
          this.$refs[formName].resetFields();
          this.$notify({title: '成功', message: "添加成功", type: 'success'});
          this.loadData();
        }).catch(() => {
          this.fullscreenLoading = false;
        })
      });
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

        this.$http.put(api.CLUSTER, JSON.stringify(this.form)).then(res => {
          this.fullscreenLoading = false;
          this.dialogEditFormVisible = false;
          this.$refs[formName].resetFields();
          this.$notify({title: '成功', message: "修改成功", type: 'success'});
          this.loadData();
        }).catch(() => {
          this.fullscreenLoading = false;
        })
      });
    },
    cancelEditSubmit(formName) {
      this.$refs[formName].resetFields();
      this.fullscreenLoading = false;
      this.dialogEditFormVisible = false;
    },
    loadData() {
      let para = {
        [this.searchKey]: this.searchVal,
        pageSize: this.tableData.pagination.pageSize,
        page: this.tableData.pagination.pageNo
      }
      sysApi.clusterList(para).then(res => {
        this.tableData.rows = res.data.items;
        this.tableData.pagination.total = res.data.total;
      });
    }
  },
  created() {
    this.searchKey = window.localStorage.getItem("clusterSearchKey");
    this.searchKey = this.searchKey === null ? "cluster_name" : this.searchKey;

    const pageSize = parseInt(window.localStorage.getItem("clusterPageSize"), 10);
    this.tableData.pagination.pageSize = Number.isFinite(pageSize) ? pageSize : 10;

    this.loadData();
  }
}
</script>
<style lang="css" scoped>
@import "../../../static/css/main.less";

</style>
