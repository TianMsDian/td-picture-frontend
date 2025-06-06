<template>
  <div id="pictureDetailPage">
    <a-row :gutter="[16, 16]">
      <!--   图片预览   -->
      <a-col :sm="24" :md="16" :xl="18">
        <a-card title="图片预览">
          <a-image :src="picture.url" style="max-height: 600px; object-fit: contain" />
        </a-card>
      </a-col>
      <!--   图片信息区域   -->
      <a-col :sm="24" :md="18" :xl="6">
        <a-card title="图片信息">
          <a-descriptions :column="1">
            <a-descriptions-item label="作者">
              <a-space>
                <a-avatar :size="24" :src="picture.user?.userAvatar" />
                <div>{{ picture.user?.userName }}</div>
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="名称">
              {{ picture.name ?? '未命名' }}
            </a-descriptions-item>
            <a-descriptions-item label="简介">
              {{ picture.introduction ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="分类">
              {{ picture.category ?? '默认' }}
            </a-descriptions-item>
            <a-descriptions-item label="标签">
              <a-tag v-for="tag in picture.tags" :key="tag">
                {{ tag }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="格式">
              {{ picture.picFormat ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽度">
              {{ picture.picWidth ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="高度">
              {{ picture.picHeight ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="宽高比">
              {{ picture.picScale ?? '-' }}
            </a-descriptions-item>
            <a-descriptions-item label="大小">
              {{ formatSize(picture.picSize) }}
            </a-descriptions-item>
            <a-descriptions-item label="主色调">
              <a-space>
                {{ picture.picColor ?? '-' }}
                <div
                  v-if="picture.picColor"
                  :style="{
                    width: '16px',
                    height: '16px',
                    backgroundColor:toHexColor(picture.picColor),
                  }"
                />
              </a-space>
            </a-descriptions-item>
          </a-descriptions>
          <!--    图片操作     -->
          <a-space wrap>
            <a-button type="primary" @click="doDownload">
              免费下载
              <template #icon>
                <DownloadOutlined />
              </template>
            </a-button>
            <a-button :icon="h(ShareAltOutlined)" type="primary" ghost  @click="doShare">
              分享
            </a-button>
            <a-button v-if="canEdit" :icon="h(EditOutlined)" type="default" @click="doEdit"
              >编辑
            </a-button>
            <a-button v-if="canDelete" :icon="h(DeleteOutlined)" danger @click="doDelete"
              >删除
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <ShareModal ref="shareModalRef" :link="shareLink" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, h, computed } from 'vue'
import { deletePictureUsingPost, getPictureVoByIdUsingGet } from '@/api/pictureController'
import { message } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined, DownloadOutlined,ShareAltOutlined } from '@ant-design/icons-vue'
import {downloadImage, formatSize, toHexColor} from '@/utils'
import { userLoginUserStore } from '@/stores/userLoginUserStore'
import { useRouter } from 'vue-router'
import ShareModal from "@/components/ShareModal.vue";
import {SPACE_PERMISSION_ENUM} from "@/constants/space";


interface Props {
  id: string | number
}

const props = defineProps<Props>()
const picture = ref<API.PictureVO>({})

// 通用权限检查函数
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (picture.value.permissionList ?? []).includes(permission)
  })
}

// 定义权限检查
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT)
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE)

// 有更新的，所以废弃掉这个方法 const loginUserStore = userLoginUserStore()
//是否具有编辑权限
//computed 计算属性 当内部有变化 另一个变量依赖这个变化就需要封装
// const canEdit = computed(() => {
//   const loginUser = loginUserStore.loginUser
//   // 未登录不可编辑
//   if (!loginUser.id) {
//     return false
//   }
//   //仅本人或管理员可编辑
//   const user = picture.value.user || {}
//   return loginUser.id === user.id || loginUser.userRole === 'admin'
// })

// 获取图片详情
const factchPictureDetail = async () => {
  try {
    const res = await getPictureVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      picture.value = res.data.data
    } else {
      message.error('获取图片详情页:' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取图片详情页:' + e.data.message)
  }
}
//首次进入页面获取
onMounted(() => {
  factchPictureDetail()
})

const router = useRouter()

const doEdit = () => {
  router.push({
    path: '/add_picture',
    query: {
      id: picture.value.id,
      spaceId: picture.value.spaceId,
    },
  })
}

const doDelete = async () => {
  const id = picture.value.id
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('删除成功')
    router.push('/')
  } else {
    message.error('删除失败')
  }
}

// 下载图片
const doDownload = () => {
  downloadImage(picture.value.url)
}

// ----- 分享操作 ----
const shareModalRef = ref()
// 分享链接
const shareLink = ref<string>()
// 分享
const doShare = () => {
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.value.id}`
  if (shareModalRef.value) {
    shareModalRef.value.openModal()
  }
}
</script>
<style scoped>
#pictureDetailPage {
}
</style>
