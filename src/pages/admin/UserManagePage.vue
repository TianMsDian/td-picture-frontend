<template>
  <div id="userManagePage">
    <!--  搜索表单  -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch" v-bind="formItemLayout">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="请输入账号" allow-clear/>
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="请输入用户名" allow-clear/>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>
    <div style="margin-bottom: 16px"></div>
    <!--  内容表格  -->
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <!--头像-->
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="90" />
        </template>
        <!--角色-->
        <template v-else-if="column.dataIndex === 'userRole'">
          <div v-if="record.userRole === 'admin'">
            <a-tag color="green">管理员</a-tag>
          </div>
          <div v-else>
            <a-tag color="blue">用户</a-tag>
          </div>
        </template>
        <!--    创建 与 修改时间    -->
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <!--        -->
        <template v-else-if="column.key === 'action'">
          <a-button danger @click="doDelete(record.id)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {deleteUserUsingPost, listUserVoByPageUsingPost} from '@/api/userController'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

//定义数据
const dataList = ref<API.UserVO[]>([])
const total = ref(0)

// 搜索条件
//  如果里面的属性会发生改变或操作最好就用reactive
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'ascend',
})



//获取数据
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败,' + res.data.message)
  }
}

//页面加载时获取数据  请求一次
onMounted(() => {
  fetchData()
})

//分页参数 不是响应式变量，上面的值如果改变这里也不会改
//computed 计算属性
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
  }
})

//表格变化后重新获取数据
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

//搜索数据
const doSearch = () => {
  // 重置页码
  searchParams.current = 1
  fetchData()
}

const doDelete = async (id: string) => {
  if (!id){
    return
  }
  const res = await  deleteUserUsingPost({id})
  if (res.data.code === 0){
    message.success('删除成功')
    //刷新数据
    fetchData()
  }else{
    message.error('删除失败')
  }
}
</script>
