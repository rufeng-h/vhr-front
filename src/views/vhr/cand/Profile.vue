<template>
  <div>
    <PageWrapper content-background>
      <div class="mx-6">
        <a-descriptions bordered title="个人基本信息">
          <template #extra>
            <a-button class="mr-2" type="primary" @click="tryEditUser">修改个人信息</a-button>
            <a-button type="primary" @click="tryModifyPwd">修改密码</a-button>
          </template>
          <a-descriptions-item label="姓名">{{ userInfo.username }}</a-descriptions-item>
          <a-descriptions-item label="籍贯">{{ userInfo.hometown }}</a-descriptions-item>
          <a-descriptions-item label="现居地">{{ userInfo.living }}</a-descriptions-item>
          <a-descriptions-item label="性别"
            ><Icon icon="twemoji:female-sign"
          /></a-descriptions-item>
          <a-descriptions-item label="邮箱">{{ userInfo.email }}</a-descriptions-item>
          <a-descriptions-item label="手机">{{ userInfo.phone }}</a-descriptions-item>
          <a-descriptions-item label="身份证号"
            ><a-tag color="orange">{{ userInfo.idCard }}</a-tag></a-descriptions-item
          >
          <a-descriptions-item label="创建时间">{{ userInfo.created }}</a-descriptions-item>
          <a-descriptions-item label="上次登录">{{ userInfo.lastLogin }}</a-descriptions-item>
        </a-descriptions>
      </div>
    </PageWrapper>
    <EditModal @register="userModal" @submit="handleSubmit" />
    <ChangePwdModal @register="pwdModal" @submit="handleModifyPwd" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { Col, Descriptions, Row, Tag } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  import EditModal from './EditModal.vue';
  import { useLoading } from '/@/components/Loading';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ChangePwdModal from './ChangePwdModal.vue';
  import { CandidateInfo, CandPwdModifyForm } from '/@/api/sys/model/userModel';
  import { updatePwd, updateCandidate } from '/@/api/sys/user';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      Icon,
      [Row.name]: Row,
      [Tag.name]: Tag,
      [Col.name]: Col,
      EditModal,
      ChangePwdModal,
      PageWrapper,
      [Descriptions.name]: Descriptions,
      [Descriptions.Item.name]: Descriptions.Item,
    },
    setup() {
      const [openFullLoading, closeFullLoading] = useLoading({ tip: '请稍后...' });
      const userStore = useUserStore();
      const { createMessage } = useMessage();
      const state = reactive({
        userInfo: userStore.getUserInfo as CandidateInfo,
      });

      const [userModal, { openModal: openUserModal }] = useModal();
      const [pwdModal, { openModal: openPwdModal }] = useModal();

      async function handleSubmit(formdata) {
        if (formdata.birth) {
          formdata.birth = dateUtil(formdata.birth).format('yyyy-MM-DD');
        }
        try {
          openFullLoading();
          const success = await updateCandidate(formdata);
          if (success) {
            Object.assign(state.userInfo, formdata);
            createMessage.success('更新个人信息成功！');
          } else {
            createMessage.error('更新失败！');
          }
        } finally {
          closeFullLoading();
        }
      }

      async function handleModifyPwd(values: CandPwdModifyForm) {
        try {
          openFullLoading();
          const success = await updatePwd(values);
          if (success) {
            createMessage.success('操作成功！请重新登录！');
            userStore.logout();
          }
        } finally {
          closeFullLoading();
        }
      }

      function tryEditUser() {
        openUserModal(true, state.userInfo);
      }

      function tryModifyPwd() {
        openPwdModal(true);
      }

      return {
        ...toRefs(state),
        handleSubmit,
        userModal,
        tryEditUser,
        tryModifyPwd,
        pwdModal,
        handleModifyPwd,
      };
    },
  });
</script>

<style lang="less" scoped>
  .change-avatar {
    img {
      display: block;
      border-radius: 50%;
    }
  }
</style>
