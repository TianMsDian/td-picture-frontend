<template>
  <div id="spaceDetailPage">
    <!--  空间信息  -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }} ({{ SPACE_TYPE_MAP[space.spaceType] }})</h2>
      <a-space size="middle">
        <a-button type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :size="42"
            :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
    <!--  搜索表单  -->
    <PictureSearchForm :onSearch="onSearch" />
    <div style="margin-bottom: 16px"></div>
    <!-- 按颜色搜索，跟其他搜索条件独立 -->
    <a-form-item label="按颜色搜索">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>
    <!--  图片列表  -->
    <PictureList :dataList="dataList" :loading="loading" :showOp="true" :onReload="fetchData" />
    <!--  分页  -->
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getSpaceVoByIdUsingGet } from '@/api/spaceController'
import { message } from 'ant-design-vue'
import {listPictureVoByPageUsingPost, searchPictureByColorUsingPost} from '@/api/pictureController'
import { formatSize } from '@/utils'
import { SPACE_TYPE_MAP } from '../constants/space'
import PictureList from '@/components/PictureList.vue'
import PictureSearchForm from '@/components/PictureSearchForm.vue'
import { ColorPicker } from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'


interface Props {
  id: string | number
}

const props = defineProps<Props>()
const space = ref<API.SpaceVO>({})

// -------------获取空间详情-------------
const factchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情页:' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情页:' + e.data.message)
  }
}
//首次进入页面获取
onMounted(() => {
  factchSpaceDetail()
})

// --------------获取图片列表--------------
//定义数据
const dataList = ref<API.PictureVO[]>([])
const total = ref(0)
const loading = ref(true)
// 搜索条件
//  如果里面的属性会发生改变或操作最好就用reactive
// ref 定义的数据 后面代码调用就必须要要加.value
const searchParams = ref<API.PictureQueryRequest>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

//获取数据
const fetchData = async () => {
  loading.value = true
  //转换搜索参数  分类
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败,' + res.data.message)
  }
  loading.value = false
}

//页面加载时获取数据  请求一次
onMounted(() => {
  fetchData()
})

//分页参数 不是响应式变量，上面的值如果改变这里也不会改
//computed 计算属性
// 分页参数
const onPageChange = (page: number, pageSize: number) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 搜索
const onSearch = (newSearchParams: API.PictureQueryRequest) => {

  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current:1,
  }
  fetchData()
}

// 按照颜色搜索
const onColorChange = async (color: string) => {
  loading.value = true
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

</script>
<style scoped>
#spaceDetailPa {
}
</style>
