<template>
  <a-card title="工作经历" :bordered="false" id="work-expr">
    <template #extra>
      <a-button
        type="primary"
        preIcon="akar-icons:circle-plus"
        @click="handleAdd"
        :disabled="showForm"
        >新 增</a-button
      >
    </template>
    <!-- 学历展示 -->
    <div
      v-for="work in workExprs"
      :key="work.workId"
      class="edu-info border-b-blue-200 border-solid border-b-1"
    >
      <div
        v-show="currentEditWorkId !== work.workId"
        class="flex flex-row justify-between items-start"
      >
        <div class="flex flex-col justify-start items-start">
          <div class="flex flex-row justify-start items-center">
            <div class="flex flex-row justify-between items-center">
              <a-image src="resource/img/logo.png" height="4rem" />
              <div class="h-16 ml-3 flex flex-col justify-around items-start">
                <div
                  ><span class="text-base mr-2">{{ work.workComp }}</span>
                  <span mr-2><a-tag color="green">海外经历</a-tag></span>
                </div>
                <div>
                  <span
                    >{{ work.workPosition }}
                    <span class="text-gray-300"> | </span>
                  </span>
                  <span>{{ major3Map[work.workInd].name }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 专业描述 -->
          <div class="mt-2">
            <span class="text-gray-300">职位描述：</span><span> {{ work.workDesc }}</span>
          </div>
        </div>

        <!-- 右侧时间和操作 -->
        <div class="flex flex-row justify-end items-center">
          <div class="mr-6">
            <span>{{ work.workStart.substring(0, 7) }}</span>
            <span> 至 </span>
            <span>{{ work.workEnd?.substring(0, 7) }}</span>
          </div>
          <div class="text-sm">
            <a-button
              type="warning"
              class="mr-1"
              @click="handleEdit(work.workId)"
              size="small"
              :disabled="showForm"
              >编辑</a-button
            >
            <a-button
              type="error"
              class="ml-1"
              @click="handleDel(work.workId)"
              size="small"
              :disabled="showForm"
              >删除</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="workExprs.length === 0 && !showForm" class="text-center text-gray-400">
      请完善工作经历</div
    >
    <div class="mt-4 py-2 border-solid border-1 border-blue-300" v-show="showForm">
      <BasicForm @register="regForm" />
      <div class="flex flex-row justify-center items-center">
        <a-button type="primary" class="mr-4" @click="handleEditCancel">取 消</a-button>
        <a-button type="primary" class="ml-4" @click="handleSubmit">确 定</a-button>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts">
  import { Card, Image, Tag } from 'ant-design-vue';
  import { defineComponent, reactive, toRefs } from 'vue';
  import { useRoute } from 'vue-router';
  import { DemoOptionsItem } from '/@/api/demo/model/optionsModel';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    majors,
    major1Map,
    major2Map,
    universities,
    eduLevels,
    findMajorByCode,
    major3Map,
    workTypeOpts,
    companySizeOpts,
    companyTypeOpts,
  } from '/@/const';
  import { formatToDate } from '/@/utils/dateUtil';
  import { cloneDeep } from 'lodash';
  import { InsertOrUpdateWorkForm, WorkExprModel } from '/@/api/vhr/work/model';
  import { addWorkExpr, delWorkExpr, updateWorkExpr } from '/@/api/vhr/work/work';

  export default defineComponent({
    name: 'WorkExpr',
    components: { BasicForm, [Card.name]: Card, [Tag.name]: Tag, [Image.name]: Image },
    props: {
      workExprs: {
        type: Array as PropType<WorkExprModel[]>,
        default: () => [],
      },
    },
    emits: ['update:workExprs'],
    setup(props, { emit }) {
      const route = useRoute();
      const { createMessage: msg, createConfirm } = useMessage();
      const state: {
        showForm: boolean;
        currentEditWorkId: number;
      } = reactive({
        showForm: false,
        currentEditWorkId: -1,
      });

      const major1Options: DemoOptionsItem[] = majors.map((item) => {
        return {
          value: item.code,
          label: item.name,
        };
      });

      const formSchema: FormSchema[] = [
        {
          field: 'workComp',
          label: '公司',
          component: 'Input',
          required: true,
          colProps: {
            span: 24,
          },
        },
        {
          field: 'workPosition',
          label: '职位',
          component: 'Input',
          required: true,
          colProps: {
            span: 11,
          },
        },
        {
          required: true,
          field: 'workDate',
          label: '时间',
          component: 'RangePicker',
          componentProps: {
            format: 'YYYY-MM-DD',
            placeholder: ['开始时间', '结束时间'],
            showTime: false,
          },
          colProps: {
            span: 9,
          },
        },

        {
          required: true,

          field: 'workCompType',
          label: '公司性质',
          component: 'Select',
          componentProps: {
            options: companyTypeOpts,
          },
          labelWidth: 0,
          colProps: {
            span: 11,
          },
        },
        {
          required: true,

          field: 'workCompSize',
          label: '公司规模',
          component: 'Select',
          componentProps: {
            options: companySizeOpts,
          },
          labelWidth: 0,
          colProps: {
            span: 9,
          },
        },

        {
          required: true,
          field: 'ind1',
          label: '行业',
          component: 'Select',
          colProps: {
            span: 8,
          },
          componentProps: ({ formModel, formActionType }) => {
            return {
              options: major1Options,
              onChange(e) {
                const { updateSchema, setFieldsValue } = formActionType;
                const options = major1Map[e].children.map((item) => {
                  return {
                    label: item.name,
                    value: item.code,
                  };
                });
                setFieldsValue({ ind2: undefined, workInd: undefined });
                /**
                 * 二级props
                 */
                updateSchema({
                  field: 'ind2',
                  componentProps: {
                    options,
                    onChange(e) {
                      const options = major2Map[e].children.map((item) => {
                        return {
                          label: item.name,
                          value: item.code,
                        };
                      });
                      formModel.workInd = undefined;
                      const { updateSchema } = formActionType;
                      updateSchema({
                        field: 'workInd',
                        componentProps: {
                          options,
                        },
                      });
                    },
                  },
                });
                /**
                 * 三级options置空
                 */
                updateSchema({
                  field: 'workInd',
                  componentProps: {
                    options: [],
                  },
                });
              },
            };
          },
        },
        {
          required: true,
          field: 'ind2',
          label: '',
          component: 'Select',
          componentProps: {},
          labelWidth: 0,
          colProps: {
            span: 6,
          },
        },
        {
          required: true,

          field: 'workInd',
          label: '',
          component: 'Select',
          componentProps: {},
          labelWidth: 0,
          colProps: {
            span: 6,
          },
        },

        {
          required: true,
          field: 'workDesc',
          label: '工作描述',
          component: 'InputTextArea',
          colProps: {
            span: 24,
          },
          componentProps: {
            placeholder: '描述你的工作范围、承担职责及取得的成绩等',
            showCount: true,
            allowClear: true,
            autoSize: {
              minRows: 4,
              maxRows: 8,
            },
          },
        },
        {
          required: true,
          field: 'workType',
          label: '工作性质',
          component: 'RadioButtonGroup',
          componentProps: {
            options: workTypeOpts,
          },
          colProps: {
            span: 9,
          },
        },
      ];
      function handleEditCancel() {
        state.showForm = false;
        state.currentEditWorkId = -1;
      }

      function findWorkIdxByWorkId(eduId: number): number {
        for (let i = 0; i < props.workExprs.length; i++) {
          if (eduId === props.workExprs[i].workId) {
            return i;
          }
        }
        return -1;
      }

      async function handleDel(id: number) {
        createConfirm({
          iconType: 'warning',
          title: '确认删除该记录吗？',
          onOk: async () => {
            if (await delWorkExpr(id)) {
              const i = findWorkIdxByWorkId(id);
              let workExprs = cloneDeep(props.workExprs);
              workExprs.splice(i, 1);
              emit('update:workExprs', workExprs);
              msg.success('删除成功!');
            }
          },
        });
      }

      async function handleSubmit() {
        const values = await validate();
        let workExpr = Object.assign({}, values);
        workExpr.workStart = formatToDate(workExpr.workDate[0]);
        workExpr.workEnd = formatToDate(workExpr.workDate[1]);
        let workExprs = cloneDeep(props.workExprs);
        if (state.currentEditWorkId !== -1) {
          workExpr.workId = state.currentEditWorkId;
          await updateWorkExpr(workExpr as InsertOrUpdateWorkForm);
          workExprs.splice(findWorkIdxByWorkId(state.currentEditWorkId), 1, workExpr);
          state.currentEditWorkId = -1;
        } else {
          workExpr.workRsId = route.params.rsId;
          workExpr = await addWorkExpr(workExpr as InsertOrUpdateWorkForm);
          workExprs.push(workExpr);
        }
        emit('update:workExprs', workExprs);
        msg.success('操作成功!');
        state.showForm = false;
      }
      const [regForm, { validate, setFieldsValue, resetFields, updateSchema }] = useForm({
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      function handleAdd() {
        resetFields();
        updateSchema({
          field: 'ind2',
          componentProps: {
            options: [],
          },
        });
        updateSchema({
          field: 'workInd',
          componentProps: {
            options: [],
          },
        });
        state.showForm = true;
      }

      function handleEdit(id) {
        const i = findWorkIdxByWorkId(id);
        const values = Object.assign({}, props.workExprs[i]);
        values['workDate'] = [props.workExprs[i].workStart, props.workExprs[i].workEnd];
        const ms = findMajorByCode(props.workExprs[i].workInd);
        updateSchema({
          field: 'ind2',
          componentProps: {
            options: ms[0].children?.map((it) => {
              return {
                label: it.name,
                value: it.code,
              };
            }),
          },
        });
        updateSchema({
          field: 'workInd',
          componentProps: {
            options: ms[1].children?.map((it) => {
              return {
                label: it.name,
                value: it.code,
              };
            }),
          },
        });
        values['ind1'] = ms[0].code;
        values['ind2'] = ms[1].code;
        values['workInd'] = ms[2].code;
        setFieldsValue(values);
        state.showForm = true;
        state.currentEditWorkId = id;
      }

      return {
        regForm,
        ...toRefs(state),
        ...toRefs(props),
        handleSubmit,
        handleEdit,
        handleDel,
        handleAdd,
        handleEditCancel,
        majors,
        universities,
        eduLevels,
        major3Map,
      };
    },
  });
</script>
<style lang="less" scoped>
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

  .edu-info {
    padding: 0.8rem 0;
  }

  .edu-info:nth-child(1) {
    padding-top: 0;
  }

  :deep(.ant-picker-range) {
    width: 100% !important;
  }

  :deep(.ant-input-affix-wrapper) {
    max-width: 395px;
  }

  :deep(.ant-input-affix-wrapper-textarea-with-clear-btn) {
    max-width: none !important;
  }
</style>
