<template>
  <a-card title="个人优势" :bordered="false" id="education">
    <template #extra>
      <a-button
        type="primary"
        preIcon="akar-icons:circle-plus"
        @click="showForm = true"
        :disabled="showForm"
        >新 增</a-button
      >
    </template>
    <div v-show="showForm">
      <BasicForm @register="regForm" />
      <div class="flex flex-row justify-center items-center">
        <a-button type="primary" class="mr-4" @click="showForm = false">取 消</a-button>
        <a-button type="primary" class="ml-4" @click="handleSubmit">确 定</a-button>
      </div>
    </div>
    <div v-show="!showForm">
      <div v-if="adv !== undefined">
        <p style="text-indent: 2em">{{ adv.advContent }}</p>
      </div>
      <div v-else class="text-center text-gray-300"> 填写个人优势，提升竞争力</div>
    </div>
  </a-card>
</template>

<script lang="ts">
  import { Card } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import { addAdvantage, updateAdvantage } from '/@/api/vhr/adv/adv';
  import { AdvantageModel } from '/@/api/vhr/adv/model';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    name: 'Advantage',
    components: { BasicForm, [Card.name]: Card },
    props: {
      adv: {
        type: Object as PropType<AdvantageModel>,
        default: undefined,
      },
    },
    emits: ['update:adv'],
    setup(props, { emit }) {
      const route = useRoute();
      const userInfo = useUserStore().getUserInfo;
      const { createMessage: msg } = useMessage();
      const state = reactive({
        showForm: false,
      });

      const formSchema: FormSchema[] = [
        {
          field: 'advContent',
          label: '个人优势',
          component: 'InputTextArea',
          required: true,
          colProps: {
            span: 24,
          },
          defaultValue: props.adv?.advContent,
          componentProps: {
            showCount: true,
            allowClear: true,
            autoSize: {
              minRows: 4,
              maxRows: 8,
            },
          },
        },
      ];
      async function handleSubmit() {
        const values = await validate();
        let adv;
        if (props.adv?.advId) {
          await updateAdvantage({
            advId: props.adv.advId,
            advContent: values.advContent,
            advCandId: userInfo.userId,
          });
          adv = Object.assign({}, props.adv);
          adv.advContent = values.advContent;
        } else {
          adv = await addAdvantage({
            advContent: values.advContent,
            advCandId: userInfo.userId,
            advRsId: parseInt(route.params.rsId as string),
          });
        }
        emit('update:adv', adv);
        msg.success('操作成功!');
        state.showForm = false;
      }
      const [regForm, { validate, setFieldsValue }] = useForm({
        labelWidth: 80,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      function handleEdit() {
        setFieldsValue({ advContent: props.adv?.advContent });
        state.showForm = true;
      }

      return { regForm, ...toRefs(state), ...toRefs(props), handleSubmit, handleEdit };
    },
  });
</script>
<style>
  :deep(.ant-card) {
    border-radius: 0.5rem;
  }

  :deep(.ant-card-head-title) {
    padding: 8px;
  }

  :deep(.ant-card-extra) {
    padding: 8px;
  }

  :deep(.ant-card-head) {
    min-height: 0;
  }

  :deep(.ant-card-body) {
    padding: 1rem;
  }
</style>
