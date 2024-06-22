import axios from "../common/axios";
import * as api from "../api";
import defaultValue from "./default";
import {MYSQL_CLUSTER_LIST, MYSQL_DATABASE_LIST, MYSQL_TABLE_LIST, TASK_REVISION} from "../api";
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

export function mysqlClusterList () {
  const clusterList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.MYSQL_CLUSTER_LIST).then(response => {
      resolve(response.data);
    }, err => {
      resolve(clusterList);
    }).catch((error) => {
        resolve(clusterList)
      })
  })
}

export function mysqlDatabaseList (clusterID) {
  const databaseList = {}
  const url = api.MYSQL_DATABASE_LIST.replace('{mysql}', clusterID);
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

export function mysqlTableList (clusterID, database) {
  const tableList = {}
  const url = api.MYSQL_TABLE_LIST.replace('{mysql}', clusterID).replace('{database}', database);
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
