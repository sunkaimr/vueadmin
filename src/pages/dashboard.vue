<template>
  <imp-panel>
    <el-tabs v-model="activeTable" @tab-click="activeTableChanged" style="min-height:550px;">
      <el-tab-pane label="任务概览" name="taskStatisticSummary">
        <div class="demo">
          <el-row :gutter=24>
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header">
            <span class="box-card-head">今日任务 -
              <span>
              {{ statisticToday.success + statisticToday.fail + statisticToday.executing + statisticToday.upcoming }}
              </span>
            </span>
                </div>
                <div class="box-card-body">
                  <div class="text item">
                    <i class="el-icon-success"/> 成&#x3000;功：<span>{{ statisticToday.success }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-error"/> 失&#x3000;败：<span>{{ statisticToday.fail }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-s-help"/> 执行中：<span>{{ statisticToday.executing }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-info"/> 待执行：<span>{{ statisticToday.upcoming }}</span>
                  </div>
                  <div class="text item-rate">
                    <i class="el-icon-question"/> 成功率：<span>{{ statisticToday.successRate }}%</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header">
            <span class="box-card-head">近一月任务 -
              <span>
              {{
                  statisticLastMonth.success + statisticLastMonth.fail + statisticLastMonth.executing + statisticLastMonth.upcoming
                }}
              </span>
            </span>
                </div>
                <div class="box-card-body">
                  <div class="text item">
                    <i class="el-icon-success"/> 成&#x3000;功：<span>{{ statisticLastMonth.success }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-error"/> 失&#x3000;败：<span>{{ statisticLastMonth.fail }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-s-help"/> 执行中：<span>{{ statisticLastMonth.executing }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-info"/> 待执行：<span>{{ statisticLastMonth.upcoming }}</span>
                  </div>
                  <div class="text item-rate">
                    <i class="el-icon-question"/> 成功率：<span>{{ statisticLastMonth.successRate }}%</span>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="box-card">
                <div slot="header">
            <span class="box-card-head">全部任务 -
              <span>
              {{ statisticTotal.success + statisticTotal.fail + statisticTotal.executing + statisticTotal.upcoming }}
              </span>
            </span>
                </div>
                <div class="box-card-body">
                  <div class="text item">
                    <i class="el-icon-success"/> 成&#x3000;功：<span>{{ statisticTotal.success }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-error"/> 失&#x3000;败：<span>{{ statisticTotal.fail }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-s-help"/> 执行中：<span>{{ statisticTotal.executing }}</span>
                  </div>
                  <div class="text item">
                    <i class="el-icon-info"/> 待执行：<span>{{ statisticTotal.upcoming }}</span>
                  </div>
                  <div class="text item-rate">
                    <i class="el-icon-question"/> 成功率：<span>{{ statisticTotal.successRate }}%</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="任务统计" name="taskStatistic">
        <div class="header-all">
          <div class="header-left">
            <el-select v-model="taskStatisticFilter.govern"
                       multiple clearable
                       size="mini"
                       collapse-tags
                       @change="taskStatisticFilterChanged"
                       placeholder="请选择清理方式">
              <el-option v-for="i in governOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
            <el-cascader
              v-model="taskCascaderValue"
              size="mini"
              :options="taskStatisticFilterOption"
              placeholder="请筛选bu、集群、库、表"
              @change="taskStatisticFilterChanged"
            />
            <el-date-picker
              v-model="taskStatisticDateRange"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              @change="taskStatisticDateRangeChanged"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="taskStatisticDateRangeOptions"
            />
          </div>
          <div class="header-rigth" style="display: flex; justify-content: flex-end">
            <el-checkbox-group v-model="taskStatisticShow" @change="taskStatisticShowChanged" size="mini">
              <el-checkbox-button label="bu">BU维度</el-checkbox-button>
              <el-checkbox-button label="cluster">集群维度</el-checkbox-button>
              <el-checkbox-button label="database">库维度</el-checkbox-button>
              <el-checkbox-button label="table">表维度</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="task-statistic-table" v-if="taskStatisticShow.indexOf('bu') !== -1">
          <el-table :data="taskStatisticDataBU" size="mini" show-summary border stripe>
            <el-table-column label="BU维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="total_quantity" label="治理数据量" align="center" sortable></el-table-column>
              <el-table-column prop="total_size" label="治理容量大小" align="center" sortable></el-table-column>
              <el-table-column prop="count" label="运行任务次数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="taskStatisticShow.indexOf('cluster') !== -1">
          <el-table :data="taskStatisticDataCluster" size="mini" show-summary border stripe>
            <el-table-column label="集群维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="total_quantity" label="治理数据量" align="center" sortable></el-table-column>
              <el-table-column prop="total_size" label="治理容量大小" align="center" sortable></el-table-column>
              <el-table-column prop="count" label="运行任务次数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="taskStatisticShow.indexOf('database') !== -1">
          <el-table :data="taskStatisticDataDatabase" size="mini" show-summary border stripe>
            <el-table-column label="库维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="database" label="库" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="total_quantity" label="治理数据量" align="center" sortable></el-table-column>
              <el-table-column prop="total_size" label="治理容量大小" align="center" sortable></el-table-column>
              <el-table-column prop="count" label="运行任务次数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="taskStatisticShow.indexOf('table') !== -1">
          <el-table :data="taskStatisticDataTable" size="mini" show-summary border stripe>
            <el-table-column label="表维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="database" label="库" align="center" sortable></el-table-column>
              <el-table-column prop="table" label="表" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="total_quantity" label="治理数据量" align="center" sortable></el-table-column>
              <el-table-column prop="total_size" label="治理容量大小" align="center" sortable></el-table-column>
              <el-table-column prop="count" label="运行任务次数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="策略统计" name="policyStatistic">
        <div class="header-all">
          <div class="header-left">
            <el-select v-model="policyStatisticFilter.govern"
                       multiple clearable
                       size="mini"
                       collapse-tags
                       @change="policyStatisticFilterChanged"
                       placeholder="请选择清理方式">
              <el-option v-for="i in governOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
            <el-cascader style="margin: 0 10px"
              v-model="policyCascaderValue"
              size="mini"
              :options="policyStatisticFilterOption"
              placeholder="请筛选BU、集群、库、表"
              @change="policyStatisticFilterChanged">
            </el-cascader>
            <el-radio-group size="mini" @input="policyEnableRadioChanged" v-model="policyEnableRadio">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">关闭</el-radio>
              <el-radio :label="0">全部</el-radio>
            </el-radio-group>
          </div>
          <div class="header-right">
            <el-checkbox-group v-model="policyStatisticShow" @change="policyStatisticShowChanged" size="mini">
              <el-checkbox-button label="bu">BU维度</el-checkbox-button>
              <el-checkbox-button label="cluster">集群维度</el-checkbox-button>
              <el-checkbox-button label="database">库维度</el-checkbox-button>
              <el-checkbox-button label="table">表维度</el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div class="task-statistic-table" v-if="policyStatisticShow.indexOf('bu') !== -1">
          <el-table :data="policyStatisticDataBU" size="mini" show-summary border stripe>
            <el-table-column label="BU维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="策略个数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="policyStatisticShow.indexOf('cluster') !== -1">
          <el-table :data="policyStatisticDataCluster" size="mini" show-summary border stripe>
            <el-table-column label="集群维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="策略个数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="policyStatisticShow.indexOf('database') !== -1">
          <el-table :data="policyStatisticDataDatabase" size="mini" show-summary border stripe>
            <el-table-column label="库维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="database" label="库" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="策略个数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-statistic-table" v-if="policyStatisticShow.indexOf('table') !== -1">
          <el-table :data="policyStatisticDataTable" size="mini" show-summary border stripe>
            <el-table-column label="表维度" align="center">
              <el-table-column prop="bu" label="BU" align="center" sortable></el-table-column>
              <el-table-column prop="cluster_name" label="集群名称" align="center" sortable></el-table-column>
              <el-table-column prop="database" label="库" align="center" sortable></el-table-column>
              <el-table-column prop="table" label="表" align="center" sortable></el-table-column>
              <el-table-column prop="govern" label="治理方式" align="center" sortable>
                <template slot-scope="scope">
                  <span v-for="i in scope.row.govern.split(',')">{{ getOptionName(governOption, i) }} </span>
                </template>
              </el-table-column>
              <el-descriptions-item label="治理频率">
                <template slot-scope="scope">
                  {{getOptionName(periodOption, scope.row.period)}}
                </template>
              </el-descriptions-item>
              <el-table-column prop="condition" label="治理条件" align="center" sortable>
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.condition" :open-delay="500" placement="top">
                    <div class="cell-ellipsis">{{ scope.row.condition }}</div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="策略个数" align="center" sortable></el-table-column>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </imp-panel>
</template>

<script>

import moment from 'moment';
import * as sysApi from "../services/sys";
import {TaskStatisticSummaryType, governOption, getOptionName, periodOption} from "../common/utils";

export default {
  name: 'project-progress',
  data() {
    return {
      policyEnableRadio: 0,
      periodOption,
      taskStatisticShow: ['bu', 'cluster', 'database', 'table'],
      policyStatisticShow: ['bu', 'cluster', 'database', 'table'],
      governOption,
      taskCascaderValue: "",
      policyCascaderValue: "",
      taskStatisticFilter: {
        bu: "",
        cluster_name: "",
        database: "",
        table: "",
        govern: "",
      },
      policyStatisticFilter: {
        bu: "",
        cluster_name: "",
        database: "",
        table: "",
        govern: "",
      },
      taskStatisticFilterOption: [],
      policyStatisticFilterOption: [],
      taskStatisticDateRange: [],
      activeTable: "taskStatisticSummary",
      statisticToday: TaskStatisticSummaryType,
      statisticLastMonth: TaskStatisticSummaryType,
      statisticTotal: TaskStatisticSummaryType,
      ganttChart: null,
      taskStatisticDateRangeOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
          }},
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(1, 'weeks').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
          }},
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
            }
          },
          {
            text: '最近三月',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(3, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
            }
          },
          {
            text: '最近半年',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(6, 'months').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              picker.$emit('pick', [moment().subtract(1, 'year').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]);
            }
          },
          {
            text: '全部',
            onClick(picker) {
              picker.$emit('pick', ['', '']);
            }
          },
        ]
      },
      // chartData: [
      //   {
      //     "id": 434,
      //     "name": "每天任务-用例30",
      //     "task_start_time": "2024-07-02 02:00:05",
      //     "task_end_time": "2024-07-02 02:00:37",
      //     "task_status": "success",
      //     "task_result_quantity": 0,
      //     "task_result_size": 0
      //   },
      //   {
      //     "id": 436,
      //     "name": "每天任务-用例31",
      //     "task_start_time": "2024-07-02 02:00:02",
      //     "task_end_time": "2024-07-02 02:00:35",
      //     "task_status": "success",
      //     "task_result_quantity": 0,
      //     "task_result_size": 0
      //   },
      //   {
      //     "id": 446,
      //     "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
      //     "task_start_time": "2024-07-02 15:45:04",
      //     "task_end_time": "2024-07-02 15:47:00",
      //     "task_status": "failed",
      //     "task_result_quantity": 0,
      //     "task_result_size": 0
      //   },
      //   {
      //     "id": 448,
      //     "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
      //     "task_start_time": "2024-07-02 15:52:04",
      //     "task_end_time": "2024-07-02 15:53:16",
      //     "task_status": "success",
      //     "task_result_quantity": 0,
      //     "task_result_size": 0
      //   },
      //   {
      //     "id": 450,
      //     "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
      //     "task_start_time": "2024-07-02 18:26:04",
      //     "task_end_time": "2024-07-02 18:27:14",
      //     "task_status": "success",
      //     "task_result_quantity": 0,
      //     "task_result_size": 0
      //   }
      // ],
      taskStatisticDataBU: [],
      taskStatisticDataCluster: [],
      taskStatisticDataDatabase: [],
      taskStatisticDataTable: [],
      policyStatisticDataBU: [],
      policyStatisticDataCluster: [],
      policyStatisticDataDatabase: [],
      policyStatisticDataTable: [],
    }
  },
  mounted() {

  },
  methods: {
    getOptionName,
    taskStatisticShowChanged() {
      window.localStorage.setItem("taskStatisticShow", this.taskStatisticShow);
    },
    policyEnableRadioChanged(){
      window.localStorage.setItem("policyEnableRadio", this.policyEnableRadio);
      this.policyStatisticFilterChanged()
    },
    policyStatisticShowChanged() {
      window.localStorage.setItem("policyStatisticShow", this.policyStatisticShow);
    },
    activeTableChanged(tab, event) {
      this.activeTable = tab.name;
      window.localStorage.setItem("taskStatisticActiveTable", this.activeTable);

      switch (this.activeTable) {
        case "taskStatisticSummary":
          this.todayStatistic();
          this.lastMonthStatistic();
          this.totalStatistic();
          break;
        case "taskStatistic":
          this.taskStatisticDateRangeChanged();
          break;
        case "policyStatistic":
          this.policyStatisticDateRangeChanged();
          break;
      }
    },
    // resizeCharts() {
    //   this.ganttChart && this.ganttChart.resize()
    // },
    todayStatistic() {
      sysApi.getTaskStatisticSummary({
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      }).then(res => {
        this.statisticToday = res.data;
        this.statisticToday.successRate = this.statisticToday.success / (this.statisticToday.fail + this.statisticToday.success) * 100
        this.statisticToday.successRate = Number.isFinite(this.statisticToday.successRate) ? this.statisticToday.successRate.toFixed(0) : 0;
      });
    },
    lastMonthStatistic() {
      sysApi.getTaskStatisticSummary({
        end_date: moment().format('YYYY-MM-DD'),
        start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      }).then(res => {
        this.statisticLastMonth = res.data;
        this.statisticLastMonth.successRate = this.statisticLastMonth.success / (this.statisticLastMonth.fail + this.statisticLastMonth.success) * 100
        this.statisticLastMonth.successRate = Number.isFinite(this.statisticLastMonth.successRate) ? this.statisticLastMonth.successRate.toFixed(0) : 0;
      });
    },
    totalStatistic() {
      sysApi.getTaskStatisticSummary({}).then(res => {
        this.statisticTotal = res.data;
        this.statisticTotal.successRate = this.statisticTotal.success / (this.statisticTotal.fail + this.statisticTotal.success) * 100
        this.statisticTotal.successRate = Number.isFinite(this.statisticTotal.successRate) ? this.statisticTotal.successRate.toFixed(0) : 0;
      });
    },
    // taskPlan() {
    //   sysApi.getTaskPlan({
    //     start_date: moment().subtract(3, 'days').format('YYYY-MM-DD'),
    //     end_date: moment().add(3, 'days').format('YYYY-MM-DD'),
    //   }).then(res => {
    //     this.chartData = res.data.tasks;
    //   });
    // },
    transformData(data) {
      const processedData = {};
      data.forEach(item => {
        if (!processedData[item.bu]) {
          processedData[item.bu] = [];
        }
        if (!processedData[item.bu][item.cluster_name]) {
          processedData[item.bu][item.cluster_name] = [];
        }
        if (!processedData[item.bu][item.cluster_name][item.database]) {
          processedData[item.bu][item.cluster_name][item.database] = [];
        }
        processedData[item.bu][item.cluster_name][item.database].push(item.table);
      });

      const cascaderOptions = [];
      for (const bu in processedData) {
        const buItem = {
          value: bu,
          label: bu,
          children: []
        };
        for (const cluster in processedData[bu]) {
          const clusterItem = {
            value: cluster,
            label: cluster,
            children: []
          };
          for (const database in processedData[bu][cluster]) {
            const databaseItem = {
              value: database,
              label: database,
              children: []
            }
            processedData[bu][cluster][database].forEach(table => {
              const tableItem = {
                value: table,
                label: table
              }
              if (databaseItem.children.length === 0) {
                databaseItem.children.push({value: "", label: "*"});
              }
              databaseItem.children.push(tableItem);
            })
            if (clusterItem.children.length === 0) {
              clusterItem.children.push({value: "", label: "*"});
            }
            clusterItem.children.push(databaseItem);
          }
          if (buItem.children.length === 0) {
            buItem.children.push({value: "", label: "*"});
          }
          buItem.children.push(clusterItem);
        }
        if (cascaderOptions.length === 0) {
          cascaderOptions.push({value: "", label: "*"});
        }
        cascaderOptions.push(buItem);
      }
      return cascaderOptions;
    },

    taskStatisticDateRangeChanged() {
      const params = {
        start_date: this.taskStatisticDateRange[0],
        end_date: this.taskStatisticDateRange[1],
        bu: this.taskStatisticFilter.bu,
        cluster_name: this.taskStatisticFilter.cluster_name,
        database: this.taskStatisticFilter.database,
        table: this.taskStatisticFilter.table,
        govern: this.taskStatisticFilter.govern[0],
      }

      sysApi.taskStatisticGroupByBu(params).then(res => {
        this.taskStatisticDataBU = res.data.data;
      });

      sysApi.taskStatisticGroupByCluster(params).then(res => {
        this.taskStatisticDataCluster = res.data.data;
      });

      sysApi.taskStatisticGroupByDatabase(params).then(res => {
        this.taskStatisticDataDatabase = res.data.data;
      });

      sysApi.taskStatisticGroupByTable(params).then(res => {
        this.taskStatisticDataTable = res.data.data;
        this.taskStatisticFilterOption = this.transformData(this.taskStatisticDataTable);
      });
    },
    policyStatisticDateRangeChanged() {
      const params = {
        bu: this.policyStatisticFilter.bu,
        cluster_name: this.policyStatisticFilter.cluster_name,
        database: this.policyStatisticFilter.database,
        table: this.policyStatisticFilter.table,
        govern: this.policyStatisticFilter.govern[0],
      }

      switch (this.policyEnableRadio) {
        case 0:
          break;
        case 1:
          params.enable = true;
          break;
        case 2:
          params.enable = false;
          break
      }

      sysApi.policyStatisticGroupByBu(params).then(res => {
        this.policyStatisticDataBU = res.data.data;
      });

      sysApi.policyStatisticGroupByCluster(params).then(res => {
        this.policyStatisticDataCluster = res.data.data;
      });
      sysApi.policyStatisticGroupByDatabase(params).then(res => {
        this.policyStatisticDataDatabase = res.data.data;
      });
      sysApi.policyStatisticGroupByTable(params).then(res => {
        this.policyStatisticDataTable = res.data.data;
        this.policyStatisticFilterOption = this.transformData(this.policyStatisticDataTable);
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeCharts)
    },
    taskStatisticFilterChanged() {
      const value = this.taskCascaderValue;
      switch (value) {
        case 1:
          this.taskStatisticFilter.bu = value[0];
          break;
        case 2:
          this.taskStatisticFilter.bu = value[0];
          this.taskStatisticFilter.cluster_name = value[1];
          break;
        case 3:
          this.taskStatisticFilter.bu = value[0];
          this.taskStatisticFilter.cluster_name = value[1];
          this.taskStatisticFilter.database = value[2];
          break;
        default:
          this.taskStatisticFilter.bu = value[0];
          this.taskStatisticFilter.cluster_name = value[1];
          this.taskStatisticFilter.database = value[2];
          this.taskStatisticFilter.table = value[3];
      }
      this.taskStatisticDateRangeChanged();
    },
    policyStatisticFilterChanged() {
      const value = this.policyCascaderValue;
      switch (value) {
        case 1:
          this.policyStatisticFilter.bu = value[0];
          break;
        case 2:
          this.policyStatisticFilter.bu = value[0];
          this.policyStatisticFilter.cluster_name = value[1];
          break;
        case 3:
          this.policyStatisticFilter.bu = value[0];
          this.policyStatisticFilter.cluster_name = value[1];
          this.policyStatisticFilter.database = value[2];
          break;
        default:
          this.policyStatisticFilter.bu = value[0];
          this.policyStatisticFilter.cluster_name = value[1];
          this.policyStatisticFilter.database = value[2];
          this.policyStatisticFilter.table = value[3];
      }
      this.policyStatisticDateRangeChanged();
    },
  },
  created() {
    this.taskStatisticShow = window.localStorage.getItem("taskStatisticShow");
    this.taskStatisticShow = this.taskStatisticShow === null ? ['bu', 'cluster', 'database', 'table'] : this.taskStatisticShow.split(',');

    const radio = parseInt(window.localStorage.getItem("policyEnableRadio"));
    this.policyEnableRadio = Number.isFinite(radio) ? radio : 0;

    this.policyStatisticShow = window.localStorage.getItem("policyStatisticShow");
    this.policyStatisticShow = this.policyStatisticShow === null ? ['bu', 'cluster', 'database', 'table'] : this.policyStatisticShow.split(',');

    this.activeTable = window.localStorage.getItem("taskStatisticActiveTable");
    this.activeTable = this.activeTable === null ? 'taskStatisticSummary' : this.activeTable
    this.activeTableChanged({name:this.activeTable})

    this.taskStatisticDateRange[0] = moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.taskStatisticDateRange[1] = moment().format('YYYY-MM-DD');
  },
}
</script>

<style lang="css" scoped>
@import "../../static/css/main.less";
.box-card-head {
  font-size: 14px;
  border-width: medium;
}

.box-card-body {
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 30px;
}

.text > span, .box-card-head > span {
  font-size: 16px;
  font-weight: bold;
}

.text.item {
  flex: 0 0 45%;
}

.text.item-rate {
  flex: 0 0 95%;
}

.header-all {
  display: flex;
  justify-content: space-between;

  .header-left {
    display: flex;
    align-items: center;

    .el-select {
      width: 150px
    }

    .el-cascader {
      margin: 0 5px;

      /deep/ .el-cascader-node__label, .el-select-dropdown__item, .el-cascader-panel {
        font-size: 12px !important;
      }
    }
  }

  .header-rigth {
    display: flex;
  }
}

.task-statistic-table {
  width: 100%;
  margin-top: 20px;
}

</style>
