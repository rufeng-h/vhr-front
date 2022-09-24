<template>
  <div>
    <ScrollContainer>
      <div ref="wrapperRef" :class="prefixCls">
        <Tabs tab-position="left" :class="tabBarStyle">
          <template v-for="item in settingList" :key="item.key">
            <TabPane :tab="item.name">
              <component :is="item.component" />
            </TabPane>
          </template>
        </Tabs>
      </div>
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Tabs } from 'ant-design-vue';

  import { ScrollContainer } from '/@/components/Container/index';
  import { settingList } from './data';

  import BaseSetting from './BaseSetting.vue';
  import SecureSetting from './SecureSetting.vue';
  import AccountBind from './AccountBind.vue';
  import MsgNotify from './MsgNotify.vue';

  export default defineComponent({
    components: {
      ScrollContainer,
      Tabs,
      TabPane: Tabs.TabPane,
      BaseSetting,
      SecureSetting,
      AccountBind,
      MsgNotify,
    },
    setup() {
      return {
        prefixCls: 'account-setting',
        settingList,
        tabBarStyle: {
          width: '100%',
          // fontSize: '1.3em',
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tabs-tab) {
    font-size: 1.2em !important;
  }

  .account-setting {
    margin: 12px;
    background-color: @component-background;

    .base-title {
      padding-left: 0;
    }

    .ant-tabs-tab-active {
      background-color: @item-active-bg;
    }
  }
</style>
