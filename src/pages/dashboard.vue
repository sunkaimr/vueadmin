<template>
  <imp-panel>
  <el-tabs v-model="activeTable" @tab-click="activeTableChanged">
    <el-tab-pane label="任务概览" name="taskStatisticSummary">
      <div class="demo">
        <el-row :gutter=24>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header">
            <span class="box-card-head">今日任务 -
              <span>
              {{ statisticToday.success + statisticToday.fail + statisticToday.executing+statisticToday.upcoming}}
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
              {{ statisticLastMonth.success + statisticLastMonth.fail + statisticLastMonth.executing + statisticLastMonth.upcoming}}
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
              {{ statisticTotal.success + statisticTotal.fail + statisticTotal.executing + statisticTotal.upcoming}}
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
      <div class="block" >
        <el-row :gutter="10">
          <el-col :span="3">
            <el-select v-model="taskStatisticFilter.govern"
                       multiple clearable
                       size="mini"
                       @change="taskStatisticFilterChanged"
                       placeholder="请选择清理方式">
              <el-option v-for="i in governOption" :key="i.value" :label="i.name" :value="i.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-cascader
              v-model="cascaderValue"
              size="mini"
              :options="taskStatisticFilterOption"
              placeholder="请筛选bu、集群、库、表"
              @change="taskStatisticFilterChanged"></el-cascader>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              v-model="taskStatisticDateRange"
              size="mini"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              @change="taskStatisticDateRangeChanged"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div style="width: 100%; margin-top: 20px;">
        <el-table :data="taskStatisticDataBU.rows" size="mini" border stripe>
            <el-table-column label="BU维度" align="center">
              <el-table-column prop="bu" label="BU" width="180"></el-table-column>
              <el-table-column prop="govern" label="治理方式" width="180"></el-table-column>
              <el-table-column prop="total_quantity" label="治理数据量"></el-table-column>
              <el-table-column prop="total_size" label="治理容量大小"></el-table-column>
              <el-table-column prop="count" label="运行任务次数"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 100%; margin-top: 20px">
        <el-table :data="taskStatisticDataCluster.rows" size="mini" border stripe>
          <el-table-column label="集群维度" align="center">
            <el-table-column prop="bu" label="BU" ></el-table-column>
            <el-table-column prop="cluster_name" label="集群名称" ></el-table-column>
            <el-table-column prop="govern" label="治理方式" ></el-table-column>
            <el-table-column prop="total_quantity" label="治理数据量"></el-table-column>
            <el-table-column prop="total_size" label="治理容量大小"></el-table-column>
            <el-table-column prop="count" label="运行任务次数"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 100%; margin-top: 20px">
        <el-table :data="taskStatisticDataDatabase.rows" size="mini" border stripe>
          <el-table-column label="库维度" align="center">
            <el-table-column prop="bu" label="BU" ></el-table-column>
            <el-table-column prop="cluster_name" label="集群名称" ></el-table-column>
            <el-table-column prop="database" label="库" ></el-table-column>
            <el-table-column prop="govern" label="治理方式" ></el-table-column>
            <el-table-column prop="total_quantity" label="治理数据量"></el-table-column>
            <el-table-column prop="total_size" label="治理容量大小"></el-table-column>
            <el-table-column prop="count" label="运行任务次数"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div style="width: 100%; margin-top: 20px">
        <el-table :data="taskStatisticDataTable.rows" size="mini" border stripe>
          <el-table-column label="表维度" align="center">
            <el-table-column prop="bu" label="BU" ></el-table-column>
            <el-table-column prop="cluster_name" label="集群名称" ></el-table-column>
            <el-table-column prop="database" label="库" ></el-table-column>
            <el-table-column prop="table" label="表" ></el-table-column>
            <el-table-column prop="govern" label="治理方式" ></el-table-column>
            <el-table-column prop="total_quantity" label="治理数据量"></el-table-column>
            <el-table-column prop="total_size" label="治理容量大小"></el-table-column>
            <el-table-column prop="count" label="运行任务次数"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="策略统计" name="policyStatistic">

    </el-tab-pane>
  </el-tabs>
  </imp-panel>
</template>
<!--    <el-divider></el-divider>-->
<!--    <el-row :gutter="24">-->
<!--      <div id="gantt-chart"></div>-->
<!--      <div class="chart-title">-->
<!--        <i class="completed">已完成</i>-->
<!--        <i class="timeout">执行中</i>-->
<!--        <i class="to-be-completed">待执行</i>-->
<!--      </div>-->
<!--    </el-row>-->


<script>
import echarts from 'echarts'
import moment from 'moment';
import * as sysApi from "../services/sys";
import {TaskStatisticSummaryType,governOption} from "../common/utils";
import {taskStatisticGroupByBu} from "../services/sys";

export default {
  name: 'project-progress',
  data() {
    return {
      governOption,
      cascaderValue: "",
      taskStatisticFilter: {
        bu: "",
        cluster_name: "",
        database: "",
        table: "",
        govern: "",
      },
      taskStatisticFilterOption: [],
      taskStatisticDateRange:[],
      activeTable: "taskStatistic",
      statisticToday : TaskStatisticSummaryType,
      statisticLastMonth: TaskStatisticSummaryType,
      statisticTotal: TaskStatisticSummaryType,
      ganttChart: null,
      chartData:   [
        {
          "id": 434,
          "name": "每天任务-用例30",
          "task_start_time": "2024-07-02 02:00:05",
          "task_end_time": "2024-07-02 02:00:37",
          "task_status": "success",
          "task_result_quantity": 0,
          "task_result_size": 0
        },
        {
          "id": 436,
          "name": "每天任务-用例31",
          "task_start_time": "2024-07-02 02:00:02",
          "task_end_time": "2024-07-02 02:00:35",
          "task_status": "success",
          "task_result_quantity": 0,
          "task_result_size": 0
        },
        {
          "id": 446,
          "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
          "task_start_time": "2024-07-02 15:45:04",
          "task_end_time": "2024-07-02 15:47:00",
          "task_status": "failed",
          "task_result_quantity": 0,
          "task_result_size": 0
        },
        {
          "id": 448,
          "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
          "task_start_time": "2024-07-02 15:52:04",
          "task_end_time": "2024-07-02 15:53:16",
          "task_status": "success",
          "task_result_quantity": 0,
          "task_result_size": 0
        },
        {
          "id": 450,
          "name": "单次任务-truncate_iop___TEST_mysql-04_performance_sale_performance_sale_detail_20cf",
          "task_start_time": "2024-07-02 18:26:04",
          "task_end_time": "2024-07-02 18:27:14",
          "task_status": "success",
          "task_result_quantity": 0,
          "task_result_size": 0
        }
      ],
      taskStatisticDataBU: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      taskStatisticDataCluster: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      taskStatisticDataDatabase: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
      taskStatisticDataTable: {
        pagination: {
          total: 0,
          pageNo: 1,
          pageSize: 10,
          parentId: 0
        },
        rows: []
      },
    }
  },
  mounted() {
    // window.addEventListener(
    //   'resize',
    //   window._.debounce(() => {
    //     this.resizeCharts()
    //   }, 100)
    // )
    // this.$nextTick(() => {
    //   this.initChart()
    // })
  },
  methods: {
    activeTableChanged(tab, event) {
      this.activeTable = tab.name;
    },
    initChart() {
      this.ganttChart = echarts.init(document.getElementById('gantt-chart'))
      const _self = this
      const chartOption = {
        title: {
          text: '任务执行计划',
          left: 10
        },
        grid: {
          containLabel: true,
          left: 40
        },
        xAxis: {
          type: 'time',
        },
        yAxis: {
          data: this.chartData.map(item => item.id)
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            // var res = params[0].name + '</br>'
            var res = '任务详情:' + '</br>'
            var date0 = params[0].data
            var date1 = params[1].data
            res += date0 + '</br>' + date1 + '</br>'
            return res
          }
        },
        series: [
          {
            name: '实际开始时间',
            type: 'bar',
            stack: 'timeout',
            itemStyle: {
              normal: {
                color: 'rgba(0,0,0,0)'
              }
            },
            lineStyle: {},
            data: this.chartData.map(item => item.task_start_time)
          },
          {
            name: '超时',
            type: 'bar',
            stack: 'timeout',
            barWidth: 10, // 柱宽度
            itemStyle: {
              normal: {
                barBorderRadius: 0, // 柱圆角
                color: function (params) {
                  let color = ''
                  // var colorList = ['#3E84E9','#c23531','#d4cece']; // 超时, 已完成, 待完成
                  var item = _self.chartData.filter(item => {
                    return item.id === params.id
                  })
                  var status = item && item[0] && item[0].status
                  // console.log('====', status)
                  color = status === 1 ? '#d4cece' : (status === 2 ? '#3E84E9' : '#c23531')
                  return color
                }
              }
            },
            data: this.chartData.map(item => item.task_end_time)
          }
        ]
      }
      this.ganttChart.setOption(chartOption)
      this.resizeCharts()
    },
    resizeCharts() {
      this.ganttChart && this.ganttChart.resize()
    },
    todayStatistic(){
      sysApi.getTaskStatisticSummary({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }).then(res => {
        this.statisticToday = res.data;
        this.statisticToday.successRate = this.statisticToday.success / (this.statisticToday.fail + this.statisticToday.success) * 100
        this.statisticToday.successRate = Number.isFinite(this.statisticToday.successRate) ? this.statisticToday.successRate.toFixed(0) : 0 ;
      });
    },
    lastMonthStatistic(){
      sysApi.getTaskStatisticSummary({
        endDate: moment().format('YYYY-MM-DD'),
        startDate: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      }).then(res => {
        this.statisticLastMonth = res.data;
        this.statisticLastMonth.successRate = this.statisticLastMonth.success / (this.statisticLastMonth.fail + this.statisticLastMonth.success) * 100
        this.statisticLastMonth.successRate = Number.isFinite(this.statisticLastMonth.successRate) ? this.statisticLastMonth.successRate.toFixed(0) : 0 ;
      });
    },
    totalStatistic(){
      sysApi.getTaskStatisticSummary({}).then(res => {
        this.statisticTotal = res.data;
        this.statisticTotal.successRate = this.statisticTotal.success / (this.statisticTotal.fail + this.statisticTotal.success) * 100
        this.statisticTotal.successRate = Number.isFinite(this.statisticTotal.successRate) ? this.statisticTotal.successRate.toFixed(0) : 0 ;
      });
    },
    taskPlan(){
      sysApi.getTaskPlan({
        start_date:moment().subtract(3, 'days').format('YYYY-MM-DD'),
        end_date: moment().add(3, 'days').format('YYYY-MM-DD'),
      }).then(res => {
        this.chartData = res.data.tasks;
      });
    },
    transformData(data) {
      const processedData = {};
      data.forEach(item => {
        if (!processedData[item.bu]) {
          processedData[item.bu] = [] ;
        }
        if (!processedData[item.bu][item.cluster_name]) {
          processedData[item.bu][item.cluster_name] = [] ;
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
            processedData[bu][cluster][database].forEach(table =>{
              const tableItem = {
                value: table,
                label: table
              }
              if (databaseItem.children.length === 0){
                databaseItem.children.push({value:"", label:"*"});
              }
              databaseItem.children.push(tableItem);
            })
            if (clusterItem.children.length === 0){
              clusterItem.children.push({value:"", label:"*"});
            }
            clusterItem.children.push(databaseItem);
          }
          if (buItem.children.length === 0){
            buItem.children.push({value:"", label:"*"});
          }
          buItem.children.push(clusterItem);
        }
        if (cascaderOptions.length === 0){
          cascaderOptions.push({value:"", label:"*"});
        }
        cascaderOptions.push(buItem);
      }
      return cascaderOptions;
    },

    taskStatisticDateRangeChanged(){
      const params = {
        start_data: this.taskStatisticDateRange[0],
        end_date: this.taskStatisticDateRange[1],
        bu: this.taskStatisticFilter.bu,
        cluster_name: this.taskStatisticFilter.cluster_name,
        database: this.taskStatisticFilter.database,
        table: this.taskStatisticFilter.table,
        govern: this.taskStatisticFilter.govern[0],
      }
      sysApi.taskStatisticGroupByBu(params).then(res => {
        this.taskStatisticDataBU.rows = res.data.data;
        this.taskStatisticDataBU.pagination.total = res.data.data.length;
      });

      sysApi.taskStatisticGroupByCluster(params).then(res => {
        this.taskStatisticDataCluster.rows = res.data.data;
        this.taskStatisticDataCluster.pagination.total = res.data.data.length;
      });
      sysApi.taskStatisticGroupByDatabase(params).then(res => {
        this.taskStatisticDataDatabase.rows = res.data.data;
        this.taskStatisticDataDatabase.pagination.total = res.data.data.length;
      });
      sysApi.taskStatisticGroupByTable(params).then(res => {
        this.taskStatisticDataTable.rows = res.data.data;
        this.taskStatisticDataTable.pagination.total = res.data.data.length;
        this.taskStatisticFilterOption = this.transformData(this.taskStatisticDataTable.rows);
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeCharts)
    },
    taskStatisticFilterChanged(){
      const value = this.cascaderValue;
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
  },
  created(){
    this.taskStatisticDateRange[0]= moment().subtract(1, 'months').format('YYYY-MM-DD');
    this.taskStatisticDateRange[1]= moment().format('YYYY-MM-DD');
    this.todayStatistic();
    this.lastMonthStatistic();
    this.totalStatistic();
    this.taskStatisticDateRangeChanged();
  },
}
</script>

<style lang="css" scoped>
  .box-card-head{
    font-size: 16px;
    border-width: medium;
  }
  .box-card-body {
    display: flex;
    flex-wrap: wrap;
    font-size: 14px;
    line-height: 30px;
  }
  .text > span{
    font-size: 18px;
    font-weight: bold;
  }
  .box-card-head>span{
    font-size: 18px;
    font-weight: bold;
  }

  .text.item {
    flex: 0 0 45%;
  }

  .text.item-rate {
    flex: 0 0 95%;
  }



  .demo {
     padding: 5px 15px;
     position: relative;
     .chart-title {
       position: absolute;
       transform: translateX(-50%);
       left: 50%;
       i {
         font-style: normal;
         padding-right: 20px;
       }
       i:before {
         content: '';
         display: inline-block;
         width: 30px;
         height: 15px;
         border-radius: 5px;
         vertical-align: bottom;
         margin-right: 3px;
         background-color: #3e84e9;
       }
       i.to-be-completed:before {
         background-color: #d4cece;
       }
       i.timeout:before {
         background-color: #c23531;
       }
     }
     #gantt-chart {
       margin: 1em auto;
       height: 600px;
       width: 100%;
       align-content: center;
     }
   }
</style>
