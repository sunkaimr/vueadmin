import pathToRegexp from "path-to-regexp";

export const getSessionKey = (key, defaultValue) => {
  const item = window.sessionStorage.getItem(key);
  if (item == undefined && defaultValue != undefined) {
    return defaultValue
  }
  return item;
}

export const getBaseUrl = (url) => {
  var reg = /^((\w+):\/\/([^\/:]*)(?::(\d+))?)(.*)/;
  reg.exec(url);
  return RegExp.$1;
}

export const keyMirror = (obj) => {
  let key
  let mirrored = {}
  if (obj && typeof obj === 'object') {
    for (key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        mirrored[ key ] = key
      }
    }
  }
  return mirrored
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = array.map(item => ({ ...item }))
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[ data[ index ][ id ] ] = data[ index ]
  })

  data.forEach((item) => {
    let hashVP = hash[ item[ pid ] ]
    if (hashVP) {
      !hashVP[ children ] && (hashVP[ children ] = [])
      hashVP[ children ].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}

export function getCurrentMenu (location, arrayMenu) {
  if (!!arrayMenu) {
    let current = []
    for (let i = 0; i < arrayMenu.length; i++) {
      const e = arrayMenu[ i ];
      const child = getCurrentMenu(location, e.children);
      if (!!child && child.length > 0) {
        child.push({ ...e, children: null });
        return child;
      }
      if (e.href && pathToRegexp(e.href).exec(location)) {
        current.push({ ...e, children: null });
        return current;
      }
    }
    return current;
  }
  return null;
}

export const sourceSearchOption = [
  {name:"ID", value:"id" },
  {name:"源端名称", value:"name" },
  {name:"BU", value:"bu" },
  {name:"集群名称", value:"cluster_name" },
  {name:"集群ID", value:"cluster_id" },
  {name:"源库名", value:"database_name" },
  {name:"源表名", value:"table_name" }
]

export const policySearchOption = [
  {name:"ID", value:"id" },
  {name:"策略名称", value:"name" },
  {name:"清理频率", value:"period" },
  {name:"清理速度", value:"cleaning_speed" },
  {name:"治理方式", value:"govern" },
  {name:"治理条件", value:"condition" },
  {name:"源端ID", value:"src_id" },
  {name:"目标端ID", value:"dest_id" }
]

export const taskSearchOption = [
  {name:"ID", value:"id" },
  {name:"任务名称", value:"name" },
  {name:"策略ID", value:"policy_id" },
  {name:"清理频率", value:"period" },
  {name:"清理速度", value:"cleaning_speed" },
  {name:"治理方式", value:"govern" },
  {name:"治理条件", value:"condition" },
  {name:"源端ID", value:"src_id" },
  {name:"目标端ID", value:"dest_id" }
]

export const periodOption=[
  {name:"一次", value:"once"},
  {name:"每天", value:"day"},
  {name:"两天", value:"two-day"},
  {name:"每周", value:"weekly"},
  {name:"每月", value:"monthly"},
  {name:"每季", value:"quarterly"},
  {name:"半年", value:"six-months"},
  {name:"每年", value:"yearly"},
]

export const governOption = [
  {name:"清空数据", value:"truncate", background:"#FFAAAA"},
  {name:"删除数据", value:"delete", background:"#FFFFE0"},
  {name:"备份删除", value:"backup-delete", background:"#DDA0DD"},
  {name:"归档数据", value:"archive", background:"#90EE90"},
  {name:"重建表", value:"recreate", background:"#ADD8E6"},
]

export const cleaningSpeedOption = [
  {name:"稳定优先", value:"steady"},
  {name:"速度适中", value:"balanced"},
  {name:"速度优先", value:"swift"},
]

export const notifyPolicyOption = [
  {name:"不通知", value:"silence"},
  {name:"成功时通知", value:"success"},
  {name:"失败时通知", value:"failed"},
  {name:"成功失败通知", value:"always"},
]

export const taskStatusOption = [
  {name:"已排期", value:"scheduled", background:"#FFFFE0" },
  {name:"填充信息失败", value:"supplement_failed", background:"#FFAAAA" },
  {name:"等待执行", value:"waiting", background:"#DDA0DD"},
  {name:"执行前检查失败", value:"exec_check_failed", background:"#FFAAAA"},
  {name:"执行中", value:"executing", background:"#ADD8E6"},
  {name:"执行成功", value:"success", background:"#90EE90"},
  {name:"执行失败", value:"failed", background:"#FFAAAA"},
  {name:"执行超时", value:"timeout", background:"#FFAAAA"},
]

export const userSearchOption= [
  { name:"用户名", value:"username" },
  { name:"姓名", value:"real_name" },
  { name:"邮箱", value:"email" },
]

export const storageOption = [
  {name:"MySQL", value:"mysql" },
  {name:"DataBend", value:"databend" },
]

export const connSearchOption = [
  { name:"ID", value:"id" },
  { name:"连接名称", value:"name" },
  { name:"BU", value:"bu" },
  // { name:"归档介质", value:"storage" },
  // { name:"地址", value:"mysql_host" },
  // { name:"用户名", value:"mysql_user" },
]

export const destSearchOption = [
  { name:"ID", value:"id" },
  { name:"目标端名称", value:"name" },
  { name:"连接ID", value:"connection_id" },
  { name:"归档介质", value:"storage" },
  { name:"目标库名", value:"database_name" },
  { name:"目标表名", value:"table_name" },
]

export const clusterSearchOption = [
  { name:"ID", value:"id" },
  { name:"集群名称", value:"cluster_name" },
  { name:"集群ID", value:"cluster_id" },
  { name:"环境", value:"env" },
  { name:"添加方式", value:"import_from" },
  { name:"集群类型", value:"cluster_type" },
  { name:"连接ID", value:"connection_id" },
  { name:"服务地址", value:"service_addr" },
  { name:"读写地址", value:"write_addr" },
  { name:"只读地址", value:"read_addr" },
  { name:"用户名", value:"user_name" },
]

export const policyNameMap= [
  { name:"名称", value:"Name" },
  { name:"说明", value:"Description" },
  { name:"开启", value:"Enable" },
  {name:"清理频率", value:"Period" },
  {name:"期望执行日期", value:"Day" },
  {name:"执行窗口", value:"ExecuteWindow" },
  {name:"清理速度", value:"CleaningSpeed" },
  {name:"治理方式", value:"Govern" },
  {name:"治理条件", value:"Condition" },
  {name:"通知策略", value:"NotifyPolicy" },
  {name:"关注人", value:"Relevant" },
]

export const taskNameMap= [
  { name:"名称", value:"Name" },
  { name:"说明", value:"Description" },
  { name:"开启", value:"Enable" },
  { name:"期望执行日期", value:"Day" },
  { name:"执行窗口", value:"ExecuteWindow" },
  { name:"通知策略", value:"NotifyPolicy" },
  { name:"关注人", value:"Relevant" },
]

export const envNameMap= [
  { name:"测试", value:"test" },
  { name:"预发", value:"stage" },
  { name:"生产", value:"prod" },
]

export const importFromNameMap= [
  { name:"手动添加", value:"customized" },
  { name:"外部导入", value:"ipaas" },
]

export function getOptionBackground(optionsArray, propValue) {
  const foundOption = optionsArray.find(option => option.value === propValue);
  return foundOption ? foundOption.background : "#fff";
}

export function getOptionName(optionsArray, propValue) {
  const foundOption = optionsArray.find(option => option.value === propValue);
  return foundOption ? foundOption.name : propValue;
}

export function beforeHandleDropdownCommand(index, row,command){
  return {
    'index': index,
    'row': row,
    'command':command
  }
}

export const tableExpandLabelStyle= {
  'min-width': '100px',
}

export const tableExpandContentStyle= {
  'min-width': '200px',
  'word-break': 'break-all'
}
