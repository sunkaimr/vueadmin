export const CONTEXT = '/mysql-enhance-pack/api/v1';


export const LOGIN = CONTEXT + '/user/login';
export const SOURCE_LIST = CONTEXT + '/source';
export const CLUSTER = CONTEXT + '/cluster';
export const CLUSTER_SYNC = CONTEXT + '/cluster/sync';
export const CLUSTER_DATABASE_LIST = CONTEXT + '/cluster/{cluster_id}/databases';
export const CLUSTER_TABLE_LIST = CONTEXT + '/cluster/{cluster_id}/{database}/tables';
export const SOURCE_ADD = CONTEXT + '/source/';
export const POLICY_LIST = CONTEXT + '/policy/';
export const POLICY_REVISION = CONTEXT + '/policy/revision';
export const POLICY_ADD = CONTEXT + '/policy/';
export const TASK_LIST = CONTEXT + '/task/';
export const TASK_REVISION = CONTEXT + '/task/revision';
export const CONN_LIST_GET = CONTEXT + '/dest/conn';
export const DEST_LIST = CONTEXT + '/dest/';
export const SYS_USER = CONTEXT + '/manage/user';
export const SYS_USER_REGISTER = CONTEXT + '/manage/user/register';
export const SYS_USER_DELETE = CONTEXT + '/manage/user/{user}';
export const SYS_CONFIG = CONTEXT + '/manage/config';
export const USER_UPDATE = CONTEXT + '/user';

