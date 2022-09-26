<template>
  <a-card title="教育经历" :bordered="false" id="education">
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
      v-for="edu in edus"
      :key="edu.eduId"
      class="edu-info border-b-blue-200 border-solid border-b-1"
    >
      <div
        v-show="currentEditEduId !== edu.eduId"
        class="flex flex-row justify-between items-start"
      >
        <div class="flex flex-col justify-start items-start">
          <div class="flex flex-row justify-start items-center">
            <div class="flex flex-row justify-between items-center">
              <a-image src="resource/img/logo.png" height="4rem" />
              <div class="h-16 ml-3 flex flex-col justify-around items-start">
                <div
                  ><span class="text-base mr-2">{{ universities[parseInt(edu.eduSchool)] }}</span
                  ><span mr-2><a-tag color="green">留学经历</a-tag></span
                  ><span><a-tag color="orange">211</a-tag></span></div
                >
                <div>
                  <span
                    >{{ eduLevels[parseInt(edu.eduEducation)] }}
                    <span class="text-gray-300"> | </span>
                  </span>
                  <span>{{ major3Map[edu.eduMajor].name }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 专业描述 -->
          <div class="mt-2" v-if="!!edu.eduMajorDesc">
            <span class="text-gray-300">专业描述：</span><span> {{ edu.eduMajorDesc }}</span>
          </div>
        </div>

        <!-- 右侧时间和操作 -->
        <div class="flex flex-row justify-end items-center">
          <div class="mr-6">
            <span>{{ edu.eduStartDate.substring(0, 7) }}</span>
            <span> 至 </span>
            <span>{{ edu.eduEndDate?.substring(0, 7) }}</span>
          </div>
          <div class="text-sm">
            <a-button
              type="warning"
              class="mr-1"
              @click="handleEdit(edu.eduId)"
              size="small"
              :disabled="showForm"
              >编辑</a-button
            >
            <a-button
              type="error"
              class="ml-1"
              @click="handleDel(edu.eduId)"
              size="small"
              :disabled="showForm"
              >删除</a-button
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="edus.length === 0 && !showForm" class="text-center text-gray-400">
      请完善教育经历</div
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
  import { EducationModel } from '/@/api/vhr/edu/model';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    majors,
    major1Map,
    major2Map,
    eduOptions,
    uniOptions,
    universities,
    eduLevels,
    findMajorByCode,
    major3Map,
  } from '/@/const';
  import { addEducation, updateEducation, delEducation } from '/@/api/vhr/edu/education';
  import { InsertOrUpdateEduForm } from '/@/api/vhr/edu/model';
  import { formatToDate } from '/@/utils/dateUtil';
  import { cloneDeep } from 'lodash';

  export default defineComponent({
    name: 'Education',
    components: { BasicForm, [Card.name]: Card, [Tag.name]: Tag, [Image.name]: Image },
    props: {
      edus: {
        type: Array as PropType<EducationModel[]>,
        default: () => [],
      },
    },
    emits: ['update:edus'],
    setup(props, { emit }) {
      const route = useRoute();
      const { createMessage: msg, createConfirm } = useMessage();
      const state: {
        showForm: boolean;
        currentEditEduId: number;
      } = reactive({
        showForm: false,
        currentEditEduId: -1,
      });

      const major1Options: DemoOptionsItem[] = majors.map((item) => {
        return {
          value: item.code,
          label: item.name,
        };
      });

      const formSchema: FormSchema[] = [
        {
          field: 'eduEducation',
          label: '最高学历',
          component: 'Select',
          required: true,
          colProps: {
            span: 13,
          },
          componentProps: {
            options: eduOptions,
          },
        },
        {
          field: 'eduFullTime',
          label: '全日制',
          defaultValue: true,
          component: 'Checkbox',
          required: true,
          helpMessage: '什么是全日制?',
          colProps: {
            span: 8,
          },
          show({ model }) {
            return model.eduEducation && model.eduEducation > '2';
          },
        },
        {
          required: true,
          field: 'eduSchool',
          label: '学 校',
          component: 'Select',
          colProps: {
            span: 13,
          },
          componentProps: {
            options: uniOptions,
            showSearch: true,
            filterOption(input, opt) {
              return opt.label.indexOf(input) !== -1;
            },
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '3';
          },
        },
        {
          required: true,
          field: 'eduDate',
          label: '起止日期',
          component: 'RangePicker',
          componentProps: {
            format: 'YYYY-MM-DD',
            placeholder: ['开始时间', '结束时间'],
            showTime: false,
          },
          colProps: {
            span: 24,
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '1';
          },
        },
        {
          field: 'm1',
          label: '所学专业',
          component: 'Select',
          colProps: {
            span: 8,
          },
          componentProps: ({ formModel, formActionType }) => {
            return {
              placeholder: '高中及以下学历选填',

              options: major1Options,
              onChange(e) {
                const { updateSchema, setFieldsValue } = formActionType;
                const options = major1Map[e].children.map((item) => {
                  return {
                    label: item.name,
                    value: item.code,
                  };
                });
                setFieldsValue({ eduMajor: undefined, m2: undefined });
                /**
                 * 二级props
                 */
                updateSchema({
                  field: 'm2',
                  componentProps: {
                    options,
                    onChange(e) {
                      const options = major2Map[e].children.map((item) => {
                        return {
                          label: item.name,
                          value: item.code,
                        };
                      });
                      formModel.eduMajor = undefined;
                      const { updateSchema } = formActionType;
                      updateSchema({
                        field: 'eduMajor',
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
                  field: 'eduMajor',
                  componentProps: {
                    options: [],
                  },
                });
              },
            };
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '1';
          },
        },
        {
          field: 'm2',
          label: '',
          component: 'Select',
          componentProps: {},
          labelWidth: 0,
          colProps: {
            span: 6,
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '1';
          },
        },
        {
          field: 'eduMajor',
          label: '',
          component: 'Select',
          componentProps: {},
          labelWidth: 0,
          colProps: {
            span: 6,
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '1';
          },
        },
        {
          field: 'eduMajorDesc',
          label: '专业描述',
          component: 'InputTextArea',
          colProps: {
            span: 24,
          },
          componentProps: {
            placeholder: '描述在校期间所学的专业，主要包括课程内容、毕业设计等',
            showCount: true,
            allowClear: true,
            autoSize: {
              minRows: 4,
              maxRows: 8,
            },
          },
          ifShow({ model }) {
            return model.eduEducation && model.eduEducation > '1';
          },
        },
      ];
      function handleEditCancel() {
        state.showForm = false;
        state.currentEditEduId = -1;
      }

      function findEduIdxByEduId(eduId: number): number {
        for (let i = 0; i < props.edus.length; i++) {
          if (eduId === props.edus[i].eduId) {
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
            if (await delEducation(id)) {
              const i = findEduIdxByEduId(id);
              let edus = cloneDeep(props.edus);
              edus.splice(i, 1);
              emit('update:edus', edus);
              msg.success('删除成功!');
            }
          },
        });
      }

      async function handleSubmit() {
        const values = await validate();
        let edu = Object.assign({}, values);
        edu.eduStartDate = formatToDate(edu.eduDate[0]);
        edu.eduEndDate = formatToDate(edu.eduDate[1]);
        let edus = cloneDeep(props.edus);
        if (state.currentEditEduId !== -1) {
          edu.eduId = state.currentEditEduId;
          await updateEducation(edu as InsertOrUpdateEduForm);
          edus.splice(findEduIdxByEduId(state.currentEditEduId), 1, edu);
          state.currentEditEduId = -1;
        } else {
          edu.eduRsId = route.params.rsId;
          edu = await addEducation(edu as InsertOrUpdateEduForm);
          edus.push(edu);
        }
        emit('update:edus', edus);
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
          field: 'm2',
          componentProps: {
            options: [],
          },
        });
        updateSchema({
          field: 'eduMajor',
          componentProps: {
            options: [],
          },
        });
        state.showForm = true;
      }

      function handleEdit(id) {
        const i = findEduIdxByEduId(id);
        const values = Object.assign({}, props.edus[i]);
        values['eduDate'] = [props.edus[i].eduStartDate, props.edus[i].eduEndDate];
        const ms = findMajorByCode(props.edus[i].eduMajor);
        updateSchema({
          field: 'm2',
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
          field: 'eduMajor',
          componentProps: {
            options: ms[1].children?.map((it) => {
              return {
                label: it.name,
                value: it.code,
              };
            }),
          },
        });
        values['m1'] = ms[0].code;
        values['m2'] = ms[1].code;
        values['eduMajor'] = ms[2].code;
        setFieldsValue(values);
        state.showForm = true;
        state.currentEditEduId = id;
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

  .edu-info {
    padding: 0.8rem 0;
  }

  .edu-info:nth-child(1) {
    padding-top: 0;
  }
</style>
