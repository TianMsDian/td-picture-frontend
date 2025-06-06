<template>
  <div id="spaceManagePage">
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1">分析公共图库</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1">分析全部空间</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!--  搜索表单  -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称">
        <a-input v-model:value="searchParams.spaceName" placeholder="请输入空间名称" allow-clear />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          style="min-width: 180px"
          placeholder="请输入空间级别"
          :options="SPACE_LEVEL_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="spaceType" label="空间类别">
        <a-select
          v-model:value="searchParams.spaceType"
          style="min-width: 180px"
          placeholder="请输入空间类别"
          :options="SPACE_TYPE_OPTIONS"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户 id">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户 id" allow-clear />
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
      <!--      :scroll="{x: 'max-content'}"-->
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>审核状态: {{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>
        <template v-if="column.dataIndex === 'spaceType'">
          <a-tag>{{ SPACE_TYPE_MAP[record.spaceType] }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'spaceUserInfo'">
          <div>大小: {{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量: {{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <!--    创建 与 修改时间    -->
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <!--  wrap 宽度不够自动换行-->
          <a-space wrap>
            <a-button type="link" :href="`/space_analyze?spaceId=${record.id}`" target="_blank">
              分析
            </a-button>
            <a-button type="link" :href="`/add_Space?id=${record.id}`" target="_blank">
              编辑
            </a-button>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {SPACE_LEVEL_MAP, SPACE_LEVEL_OPTIONS, SPACE_TYPE_MAP, SPACE_TYPE_OPTIONS} from '../../constants/space'
import { formatSize } from '../../utils'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUserInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

//定义数据
const dataList = ref<API.Space[]>([])
const total = ref(0)

// 搜索条件
//  如果里面的属性会发生改变或操作最好就用reactive
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

//获取数据
const fetchData = async () => {
  const res = await listSpaceByPageUsingPost({
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
  if (!id) {
    return
  }
  const res = await deleteSpaceUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    //刷新数据
    fetchData()
  } else {
    message.error('删除失败')
  }
}
</script>
