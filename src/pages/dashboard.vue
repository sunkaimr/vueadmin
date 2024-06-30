<template>
  <div class="demo">
    <el-row :gutter=24>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span class="box-card-head">今日任务 - <span>30</span></span>
          </div>
          <div class="box-card-body">
            <div class="text item">
              <i class="el-icon-success"/> 成&#x3000;功：<span>33</span>
            </div>
            <div class="text item">
              <i class="el-icon-error"/> 失&#x3000;败：<span>30</span>
            </div>
            <div class="text item">
              <i class="el-icon-s-help"/> 执行中：<span>3</span>
            </div>
            <div class="text item">
              <i class="el-icon-info"/> 待执行：<span>13</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span class="box-card-head">本月任务 - <span>3340</span></span>
          </div>
          <div class="box-card-body">
            <div class="text item">
              <i class="el-icon-success"/> 成&#x3000;功：<span>3453</span>
            </div>
            <div class="text item">
              <i class="el-icon-error"/> 失&#x3000;败：<span>30</span>
            </div>
            <div class="text item">
              <i class="el-icon-s-help"/> 执行中：<span>34</span>
            </div>
            <div class="text item">
              <i class="el-icon-info"/> 待执行：<span>1453</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">
            <span class="box-card-head">全部任务 - <span>37650</span></span>
          </div>
          <div class="box-card-body">
            <div class="text item">
              <i class="el-icon-success"/> 成&#x3000;功：<span>3673</span>
            </div>
            <div class="text item">
              <i class="el-icon-error"/> 失&#x3000;败：<span>3670</span>
            </div>
            <div class="text item">
              <i class="el-icon-s-help"/> 执行中：<span>36</span>
            </div>
            <div class="text item">
              <i class="el-icon-info"/> 待执行：<span>16763</span>
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
import echarts from 'echarts' // 注意echarts版本，高版本不支持透明度rgba,以下代码版本为3.8.5
export default {
  name: 'project-progress',
  data() {
    return {
      ganttChart: null,
      chartData: [
        { id: 1, name: '任务1', start: '2024-02-01 02:00:00', end: '2024-02-01 08:00:00', status: 2 },
        { id: 2, name: '任务2', start: '2024-02-02 02:00:00', end: '2024-02-02 15:00:00', status: 2 },
        { id: 3, name: '任务3', start: '2024-02-03 02:00:00', end: '2024-02-03 02:01:00', status: 2 },
        { id: 4, name: '任务4', start: '2024-02-04 02:00:00', end: '2024-02-06 04:00:00', status: 2 },
        { id: 5, name: '任务5', start: '2024-02-05 02:00:00', end: '2024-02-05 05:00:00', status: 2 },
        { id: 6, name: '任务6', start: '2024-02-06 02:00:00', end: '2024-02-06 05:00:00', status: 2 },
        { id: 7, name: '任务7', start: '2024-02-07 02:00:00', end: '2024-02-07 15:00:00', status: 2 },
        { id: 8, name: '任务8', start: '2024-02-08 02:00:00', end: '2024-02-08 05:00:00', status: 2 },
        { id: 9, name: '任务9', start: '2024-02-09 02:00:00', end: '2024-02-09 05:00:00', status: 2 },
        { id: 10, name: '任务10', start: '2024-02-09 02:00:00', end: '2024-02-10 05:00:00', status: 2 },
        { id: 11, name: '任务11', start: '2024-02-11 01:00:00', end: '2024-02-11 05:00:00', status: 2 },
        // { id: 12, name: '任务12', start: '2024-02-12 04:00:00', end: '2024-02-12 12:00:00', status: 2 },
        // { id: 13, name: '任务13', start: '2024-02-13 02:00:00', end: '2024-02-13 05:00:00', status: 2 },
        // { id: 14, name: '任务14', start: '2024-02-14 01:00:00', end: '2024-02-14 05:00:00', status: 2 },
        // { id: 15, name: '任务15', start: '2024-02-15 02:00:00', end: '2024-02-15 03:00:00', status: 2 },
        // { id: 16, name: '任务16', start: '2024-02-13 02:00:00', end: '2024-02-16 15:00:00', status: 2 },
        // { id: 17, name: '任务17', start: '2024-02-17 02:00:00', end: '2024-02-17 05:00:00', status: 2 },
        // { id: 18, name: '任务18', start: '2024-02-18 02:00:00', end: '2024-02-18 05:00:00', status: 2 },
        // { id: 19, name: '任务19', start: '2024-02-19 02:00:00', end: '2024-02-19 05:00:00', status: 2 },
        // { id: 20, name: '任务20', start: '2024-02-20 02:00:00', end: '2024-02-20 05:00:00', status: 2 },
        // { id: 21, name: '任务21', start: '2024-02-21 02:00:00', end: '2024-02-21 05:00:00', status: 2 },
        // { id: 22, name: '任务22', start: '2024-02-22 02:00:00', end: '2024-02-22 05:00:00', status: 2 },
        // { id: 23, name: '任务23', start: '2024-02-23 02:00:00', end: '2024-02-23 05:00:00', status: 2 },
        // { id: 24, name: '任务24', start: '2024-02-24 02:00:00', end: '2024-02-24 05:00:00', status: 2 },
        // { id: 25, name: '任务25', start: '2024-02-25 02:00:00', end: '2024-02-25 05:00:00', status: 2 },
        // { id: 26, name: '任务26', start: '2024-02-26 02:00:00', end: '2024-02-26 05:00:00', status: 2 },
        // { id: 27, name: '任务27', start: '2024-02-27 02:00:00', end: '2024-02-27 05:00:00', status: 2 },
        // { id: 28, name: '任务28', start: '2024-02-28 02:00:00', end: '2024-02-28 05:00:00', status: 2 },
        // { id: 29, name: '任务29', start: '2024-02-29 02:00:00', end: '2024-02-29 05:00:00', status: 2 },
        // { id: 30, name: '任务30', start: '2024-02-29 02:00:00', end: '2024-02-29 05:00:00', status: 2 },
        // { id: 31, name: '任务31', start: '2024-02-11 02:00:00', end: '2024-02-11 05:00:00', status: 2 },
        // { id: 32, name: '任务32', start: '2024-02-12 02:00:00', end: '2024-02-12 05:00:00', status: 2 },
        // { id: 33, name: '任务33', start: '2024-02-13 02:00:00', end: '2024-02-13 05:00:00', status: 2 },
        // { id: 34, name: '任务34', start: '2024-02-14 02:00:00', end: '2024-02-14 05:00:00', status: 2 },
        // { id: 35, name: '任务35', start: '2024-02-15 02:00:00', end: '2024-02-15 05:00:00', status: 2 },
        // { id: 36, name: '任务36', start: '2024-02-16 02:00:00', end: '2024-02-16 05:00:00', status: 2 },
        // { id: 37, name: '任务37', start: '2024-02-17 02:00:00', end: '2024-02-17 05:00:00', status: 2 },
        // { id: 38, name: '任务38', start: '2024-02-18 02:00:00', end: '2024-02-18 02:01:00', status: 2 },
        // { id: 39, name: '任务39', start: '2024-02-19 02:00:00', end: '2024-02-19 05:00:00', status: 2 },
        // { id: 40, name: '任务40', start: '2024-02-29 02:00:00', end: '2024-02-29 05:00:00', status: 2 },
        // { id: 41, name: '任务41', start: '2024-02-29 02:00:00', end: '2024-02-29 05:00:00', status: 2 },
        // { id: 42, name: '任务42', start: '2024-02-11 02:00:00', end: '2024-02-11 05:00:00', status: 2 },
        // { id: 43, name: '任务43', start: '2024-02-12 02:00:00', end: '2024-02-12 05:00:00', status: 2 },
        // { id: 44, name: '任务44', start: '2024-02-13 02:00:00', end: '2024-02-13 05:00:00', status: 2 },
        // { id: 45, name: '任务45', start: '2024-02-14 02:00:00', end: '2024-02-14 05:00:00', status: 2 },
        // { id: 46, name: '任务46', start: '2024-02-15 02:00:00', end: '2024-02-15 05:00:00', status: 2 },
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
          data: this.chartData.map(item => item.name)
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            // var res = params[0].name + '</br>'
            var res = '任务详情:' + '</br>'
            var date0 = params[0].data
            var date1 = params[1].data
            res += date0 + '</br>' + date1 + '</br>'
            console.log(params)
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
            data: this.chartData.map(item => item.start)
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
                    return item.name === params.name
                  })
                  var status = item && item[0] && item[0].status
                  // console.log('====', status)
                  color = status === 1 ? '#d4cece' : (status === 2 ? '#3E84E9' : '#c23531')
                  return color
                }
              }
            },
            data: this.chartData.map(item => item.end)
          }
        ]
      }
      this.ganttChart.setOption(chartOption)
      this.resizeCharts()
    },
    resizeCharts() {
      this.ganttChart && this.ganttChart.resize()
    },
    destroyed() {
      window.removeEventListener('resize', this.resizeCharts)
    }
  }
}
</script>


<style lang="css" scoped>
  .box-card-head{
    font-size: 18px;
    border-width: medium;
  }
  .box-card-body {
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    line-height: 30px;
  }
  .text > span{
    font-size: 22px;
  }
  .box-card-head>span{
    font-size: 24px;
  }

  .text.item {
    flex: 0 0 45%; /* 占据50%的容器宽度，不伸缩 */
  }

  /* 可选：如果你想要添加一些间距，可以使用margin
  .text.item:nth-child(odd) {
    margin-right: 1px;
  }
  */
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
