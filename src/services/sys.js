import axios from "../common/axios";
import * as api from "../api";
import defaultValue from "./default";
import {
  CLUSTER,
  CLUSTER_DATABASE_LIST,
  CLUSTER_TABLE_LIST,
  TASK_PLAN,
  TASK_REVISION, TASK_STATISTIC_BU, TASK_STATISTIC_CLUSTER, TASK_STATISTIC_DATABASE,
  TASK_STATISTIC_SUMMARY, TASK_STATISTIC_TABLE
} from "../api";
import qs from 'qs'

export function login (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.LOGIN, params).then(response => {
        resolve(response.data);
    }).catch((error) => {
      reject(error);
    })
  })
}
export function userList (params) {
  const userList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_USER, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(userList);
    })
      .catch((error) => {
        resolve(userList)
      })
  })
}

export function sourceList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.SOURCE_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(sourceList);
    })
      .catch((error) => {
        resolve(sourceList)
      })
  })
}

export function policyList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.POLICY_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(sourceList);
    })
      .catch((error) => {
        resolve(sourceList)
      })
  })
}

export function taskList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_LIST, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(sourceList);
    })
      .catch((error) => {
        resolve(sourceList)
      })
  })
}

export function connList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.CONN_LIST_GET, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(sourceList);
    })
      .catch((error) => {
        resolve(sourceList)
      })
  })
}

export function getDestList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.DEST_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(sourceList);
    })
      .catch((error) => {
        resolve(sourceList)
      })
  })
}

export function clusterList (params) {
  const clusterList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.CLUSTER,{params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(clusterList);
    }).catch((error) => {
        resolve(clusterList)
      })
  })
}

export function clusterDatabaseList (clusterID) {
  const databaseList = {}
  const url = api.CLUSTER_DATABASE_LIST.replace('{cluster_id}', clusterID);
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      resolve(response.data);
    }, err => {
      resolve(databaseList);
    }).catch((error) => {
      resolve(databaseList)
    })
  })
}

export function clusterTableList (clusterID, database) {
  const tableList = {}
  const url = api.CLUSTER_TABLE_LIST.replace('{cluster_id}', clusterID).replace('{database}', database);
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      resolve(response.data);
    }, err => {
      resolve(tableList);
    }).catch((error) => {
      resolve(tableList)
    })
  })
}


export function destList (params) {
  const destinationList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.DEST_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(destinationList);
    })
      .catch((error) => {
        resolve(destinationList)
      })
  })
}

export function getConfig () {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_CONFIG).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

export function getPolicyRevision (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.POLICY_REVISION, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

export function getTaskRevision (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_REVISION, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

export function getTaskStatisticSummary(params){
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_STATISTIC_SUMMARY, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}

export function getTaskPlan(params){
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_PLAN, {params}).then(response => {
      resolve(response.data);
    }, err => {
      resolve(err);
    })
      .catch((error) => {
        resolve(error)
      })
  })
}


export function taskStatisticGroupByBu (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_STATISTIC_BU, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve([]);
    })
      .catch((error) => {
        resolve([])
      })
  })
}

export function taskStatisticGroupByCluster (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_STATISTIC_CLUSTER, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve([]);
    })
      .catch((error) => {
        resolve([])
      })
  })
}

export function taskStatisticGroupByDatabase (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_STATISTIC_DATABASE, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve([]);
    })
      .catch((error) => {
        resolve([])
      })
  })
}

export function taskStatisticGroupByTable (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.TASK_STATISTIC_TABLE, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve([]);
    })
      .catch((error) => {
        resolve([])
      })
  })
}
