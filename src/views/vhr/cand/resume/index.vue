<template>
  <PageWrapper title="我的简历">
    <template #extra>
      <a-button
        type="primary"
        pre-icon="ant-design:plus-circle-outlined"
        @click="addResume"
        :disabled="dataSource.length === 3"
        >新增简历</a-button
      ></template
    >

    <a-list
      class="list"
      itemLayout="vertical"
      size="large"
      :pagination="false"
      :data-source="dataSource"
    >
      <template #footer>
        <a-alert
          message="温馨提示"
          :description="
            '1. 只有确认过的并且设置为可投递的简历方可进行岗位投递。' +
            `\n` +
            '2. 已确认的简历不能进行修改，如需更新简历信息，请点击“创建简历”按钮。' +
            `\n` +
            '3. 岗位投递时您可选择确认过的可投递简历进行投递，可投递简历最多可设置5个。' +
            `\n` +
            '4. 默认简历只做为当有多份可投递简历投递时默认显示在第一位。'
          "
          type="info"
          show-icon
        />
      </template>
      <template #renderItem="{ item }">
        <a-list-item :key="item.rsId">
          <template #actions>
            <span v-for="{ icon, color, action, text } in actions" :key="icon">
              <Icon :icon="icon" :color="color" @click="action" :size="16" />
              {{ text }}
            </span>
          </template>
          <template #extra>
            <div class="h-full flex flex-col justify-around items-end">
              <div>
                <a-tag>公开简历</a-tag>
                <a-tag>公开简历</a-tag>
                <a-tag>公开简历</a-tag>
                <a-tag>可投递</a-tag>
                <a-tag>快速投递</a-tag>
              </div>
              <div>创建时间：{{ item.rsCreated }}</div>
              <div>最后更新：{{ item.rsModified }}</div>
            </div>
          </template>
          <a-list-item-meta :description="item.rsDesc">
            <template #title>
              <div>{{ item.rsName }}</div>
            </template>
            <template #avatar><a-avatar src="resource/img/logo.png" /></template>
          </a-list-item-meta>
          <a-tag>公开简历</a-tag>
          <a-tag>公开简历</a-tag>
          <a-tag>公开简历</a-tag>
        </a-list-item>
      </template>
    </a-list>
  </PageWrapper>
</template>
<script lang="ts">
  import { Avatar, Tag, Alert } from 'ant-design-vue';
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { PageWrapper } from '/@/components/Page';
  import { List, InputSearch, Form } from 'ant-design-vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { listResume } from '/@/api/vhr/resume/resume';
  import { useUserStore } from '/@/store/modules/user';
  import { ResumeModel } from '/@/api/vhr/resume/model';

  export default defineComponent({
    components: {
      Icon,
      [Alert.name]: Alert,
      [Tag.name]: Tag,
      [Avatar.name]: Avatar,
      [Form.name]: Form,
      [Form.Item.name]: Form.Item,
      [InputSearch.name]: InputSearch,
      PageWrapper,
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
    },
    setup() {
      const go = useGo();
      const userInfo = useUserStore().getUserInfo;
      const { createConfirm } = useMessage();
      onMounted(() => {
        fetchData();
      });
      const fetchData = async () => {
        try {
          state.loading = true;
          state.dataSource = await listResume(userInfo.userId);
        } finally {
          state.loading = false;
        }
      };
      const state = reactive<{
        dataSource: ResumeModel[];
        loading: boolean;
      }>({
        dataSource: [],
        loading: false,
      });
      const addGroup = () => {
        go({
          //@ts-ignore
          name: 'BaseDataSubjectGroupAdd',
        });
      };
      const actions: any[] = [
        {
          icon: 'akar-icons:more-horizontal',
          color: '#33f834',
          action: () => {},
          size: 20,
          text: '详情',
        },
        { icon: 'bxs:edit', color: '#018ffb', action: () => {}, size: 20, text: '编辑' },
        { icon: 'ep:delete-filled', color: '#f00', action: handleDel, size: 20, text: '删除' },
        // { icon: 'mdi:database-import', color: '#42d27d', action: () => {}, size: 20 },
      ];
      async function handleDel(item: SubGroupInfoModel) {
        createConfirm({
          iconType: 'warning',
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const data = await delSubGrp(item.grpId);
            if (data) {
              fetchData();
            }
          },
          title: `删除科目组${item.grpName}?`,
        });
      }

      function addResume() {}
      return {
        ...toRefs(state),
        addResume,
        actions,
      };
    },
  });
</script>

<style lang="less" scoped>
  :deep(.ant-list-item) {
    background-color: @component-background;
    margin-bottom: 0.5rem;
    border-radius: 8px;
  }

  :deep(.ant-alert-description) {
    white-space: pre-wrap !important;
  }

  :deep(.ant-alert) {
    border-radius: 8px;
  }
</style>
