<template>
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
            <div class="text item">
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
            <div class="text item">
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
            <div class="text item">
              <i class="el-icon-question"/> 成功率：<span>{{ statisticTotal.successRate }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row :gutter="24">
      <div id="gantt-chart"></div>
<!--      <div class="chart-title">-->
<!--        <i class="completed">已完成</i>-->
<!--        <i class="timeout">执行中</i>-->
<!--        <i class="to-be-completed">待执行</i>-->
<!--      </div>-->
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment';
import * as sysApi from "../services/sys";
import {TaskStatisticSummaryType} from "../common/utils";

export default {
  name: 'project-progress',
  data() {
    return {
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
      ]
    }
  },
  mounted() {
    window.addEventListener(
      'resize',
      window._.debounce(() => {
        this.resizeCharts()
      }, 100)
    )
    this.$nextTick(() => {
      this.initChart()
    })

  },
  methods: {
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
        startDate:moment().subtract(3, 'days').format('YYYY-MM-DD'),
        endDate: moment().add(3, 'days').format('YYYY-MM-DD'),
      }).then(res => {
        this.chartData = res.data.tasks;
      });
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeCharts)
    },
  },
  created(){
    this.todayStatistic();
    this.lastMonthStatistic();
    this.totalStatistic();
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
