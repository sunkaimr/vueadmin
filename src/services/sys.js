import axios from "../common/axios";
import * as api from "../api";
import defaultValue from "./default";
import {MYSQL_CLUSTER_LIST, MYSQL_DATABASE_LIST, MYSQL_TABLE_LIST} from "../api";

export function login (params) {
  return new Promise((resolve, reject) => {
    axios.put(api.LOGIN, { username:params.username, password: params.password}).then(response => {
        resolve(response.data);
    }).catch((error) => {
      reject(error);
    })
  })
}
export function msgList (params) {
  return new Promise((resolve, reject) => {
    axios.post(api.MSG_TOP_TEN, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.msgList);
    })
      .catch((error) => {
        resolve(defaultValue.msgList)
      })
  })
}


export function menuList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.menuList);
    })
      .catch((error) => {
        resolve(defaultValue.menuList)
      })
  })
}

export function resourceList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_RESOURCE_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.resource);
    })
      .catch((error) => {
        resolve(defaultValue.resource)
      })
  })
}

export function roleList (params) {
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_MENU_LIST, { params }).then(response => {
      resolve(response.data);
    }, err => {
      resolve(defaultValue.roleList);
    })
      .catch((error) => {
        resolve(defaultValue.roleList)
      })
  })
}

export function userList (params) {
  const userList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.SYS_USER_GET, { params }).then(response => {
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
    axios.get(api.POLICY_LIST_GET, { params }).then(response => {
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
    axios.get(api.TASK_LIST_GET, { params }).then(response => {
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

export function destList (params) {
  const sourceList = {}
  return new Promise((resolve, reject) => {
    axios.get(api.DEST_LIST_GET, { params }).then(response => {
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
