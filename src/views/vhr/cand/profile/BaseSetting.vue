<template
  ><div>
    <CollapseContainer :canExpan="false" defaultShow>
      <template #title>
        <div class="h-15 flex flex-row items-center">
          <Icon icon="carbon:user-avatar-filled-alt" :size="30" color="skyblue" />
          <span class="text-lg ml-2">个人基本信息</span>
        </div>
      </template>
      <div class="flex flex-row justify-between items-center">
        <div class="my-2 2xl:mx-6">
          <div>
            <CropperAvatar
              :uploadApi="uploadCandAvatar"
              :value="avatar"
              btnText="更换头像"
              :btnProps="{ preIcon: 'ant-design:cloud-upload-outlined' }"
              @change="updateAvatar"
              width="150"
            />
          </div>
          <div class="mt-2 flex flex-row items-center justify-around">
            <div>
              <Icon v-if="gender === 'M'" icon="twemoji:male-sign" :size="15" />
              <Icon v-else icon="twemoji:female-sign" :size="20" />
              <span class="ml-2">{{ gender === 'M' ? '男' : '女' }}</span>
            </div>
            <div>{{ birth }}</div>
          </div>
        </div>
        <div>
          <BasicForm @register="register">
            <template #email="{ model, field }">
              <a-input-group compact>
                <a-input disabled v-model:value="model[field]" style="width: calc(100% - 64px)" />
                <a-button type="primary" @click="openModal(true)">修改</a-button>
              </a-input-group>
            </template>
            <template #phone="{ model, field }">
              <a-input-group compact>
                <a-input disabled v-model:value="model[field]" style="width: calc(100% - 64px)" />
                <a-button type="primary">修改</a-button>
              </a-input-group>
            </template>
          </BasicForm>
        </div>
      </div>
      <div class="text-center">
        <a-button type="primary" class="2xl:w-24 mx-2" @click="resetForm">重 置</a-button>
        <a-button type="primary" class="2xl:w-24 mx-2" @click="handleUpdateInfo">更 新</a-button>
      </div>
    </CollapseContainer>
    <CollapseContainer :canExpan="false" defaultShow>
      <template #title>
        <div class="h-15 flex flex-row items-center justify-between">
          <Icon icon="clarity:users-solid" :size="30" color="orange" />
          <span class="text-lg ml-2">家庭成员信息</span>
        </div>
      </template>
      <div class="text-center text-lg">
        <BasicTable @register="tableRef" @edit-change="onEditChange">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="createActions(record, column)" />
            </template>
          </template>
        </BasicTable>
        <div class="flex justify-center flex-row items-center">
          <!-- <span class="text-gray-300 mr-2 text-base">暂无数据，请添加</span> -->
          <a-button
            :disabled="!!currentEditKey"
            preIcon="akar-icons:circle-plus"
            :iconSize="26"
            size="large"
            shape="round"
            @click="addFmRecord"
          />
        </div>
      </div>
    </CollapseContainer>
    <ModifyEmailModal @register="registerModal" @success="updateEmailSuccess" />
  </div>
</template>
<script lang="ts">
  import { Card, Input } from 'ant-design-vue';
  import { computed, defineComponent, nextTick, onMounted, reactive, toRefs } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { CropperAvatar } from '/@/components/Cropper';

  import { useMessage } from '/@/hooks/web/useMessage';

  import headerImg from '/@/assets/images/header.jpg';
  import { baseSetschemas, cityMap, countryMap, provinceMap } from './data';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadApi } from '/@/api/sys/upload';
  import Icon from '/@/components/Icon';
  import { CandidateInfo } from '/@/api/sys/model/userModel';
  import { cloneDeep } from 'lodash';
  import {
    ActionItem,
    BasicColumn,
    BasicTable,
    EditRecordRow,
    useTable,
    TableAction,
  } from '/@/components/Table';
  import {
    addFamily,
    delFamily,
    fmColumns,
    listFamilies,
    updateFamily,
  } from '/@/api/vhr/family/family';
  import { InsertOrUpdateFamilyForm } from '/@/api/vhr/family/model/familyModel';
  import { useModal } from '/@/components/Modal';
  import ModifyEmailModal from '../ModifyEmailModal.vue';
  import { updateCandInfo, uploadCandAvatar } from '/@/api/vhr/cand/candidate';
  import { deepMerge } from '/@/utils';
  import { useLoading } from '/@/components/Loading';

  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      BasicTable,
      Icon,
      TableAction,
      CropperAvatar,
      [Card.name]: Card,
      [Input.name]: Input,
      [Input.Group.name]: Input.Group,
      ModifyEmailModal,
    },
    setup() {
      const { createMessage: msg } = useMessage();
      const userStore = useUserStore();
      const [openFullLoading, closeFullLoading] = useLoading({
        tip: '请稍后...',
      });

      const candInfo = userStore.getUserInfo as CandidateInfo;
      const idCard = candInfo.idCard;
      const state: {
        currentEditKey: string;
        userInfo: CandidateInfo;
        birth: string;
        gender: 'M' | 'F';
      } = reactive({
        currentEditKey: '',
        birth:
          idCard.substring(6, 10) + '-' + idCard.substring(10, 12) + '-' + idCard.substring(12, 14),
        userInfo: userStore.getUserInfo as CandidateInfo,
        gender: parseInt(idCard.substring(16)) % 2 === 0 ? 'F' : 'M',
      });

      const [register, { setFieldsValue, validate: validateForm, updateSchema }] = useForm({
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: baseSetschemas,
      });

      const handleUpdateInfo = async () => {
        const values = await validateForm();
        values.candId = state.userInfo.userId;
        try {
          openFullLoading();
          if (await updateCandInfo(values)) {
            msg.success('修改成功！');
            deepMerge(state.userInfo, values);
            setFormInitValue();
          }
        } finally {
          closeFullLoading();
        }
      };

      const resetForm = () => {
        setFormInitValue();
      };

      function setFormInitValue() {
        const values = cloneDeep(state.userInfo);
        if (!!values.living) {
          const code = values.living;
          const p = provinceMap[code.substring(0, 2).padEnd(6, '0')];
          const c = cityMap[code.substring(0, 4).padEnd(6, '0')];
          updateSchema({
            field: 'living1',
            componentProps: {
              options: p.children.map((it) => {
                return {
                  value: it.code,
                  label: it.name,
                };
              }),
            },
          });
          updateSchema({
            field: 'living',
            componentProps: {
              options: c.children.map((it) => {
                return {
                  value: it.code,
                  label: it.name,
                };
              }),
            },
          });
          values['living0'] = p?.code;
          values['living1'] = c?.code;
          values['living'] = countryMap[code]?.code;
        }
        if (!!values.hometown) {
          const code = values.hometown;
          const p = provinceMap[code.substring(0, 2).padEnd(6, '0')];
          const c = cityMap[code.substring(0, 4).padEnd(6, '0')];
          updateSchema({
            field: 'hometown1',
            componentProps: {
              options: p.children.map((it) => {
                return {
                  value: it.code,
                  label: it.name,
                };
              }),
            },
          });
          updateSchema({
            field: 'hometown',
            componentProps: {
              options: c.children.map((it) => {
                return {
                  value: it.code,
                  label: it.name,
                };
              }),
            },
          });
          values['hometown0'] = p?.code;
          values['hometown1'] = c?.code;
          values['hometown'] = countryMap[code]?.code;
        }

        setFieldsValue(values);
      }

      onMounted(async () => {
        setFormInitValue();
      });

      const avatar = computed(() => {
        const { avatar } = state.userInfo;
        return avatar || headerImg;
      });

      function updateAvatar({ uri }) {
        state.userInfo.avatar = uri;
      }

      function updateEmailSuccess(email) {
        msg.success('操作成功');
        setFieldsValue({ email });
      }

      /** Edit Table Start **/

      function addFmRecord() {
        getDataSource().push({});
        nextTick(async () => {
          const source = getDataSource();
          const record: EditRecordRow = source[source.length - 1];
          console.log(record);

          state.currentEditKey = record.key;
          record.onEdit?.(true);
        });
      }

      function handleEdit(record: EditRecordRow) {
        state.currentEditKey = record.key;
        record.onEdit?.(true);
      }

      async function handleCancel(record: EditRecordRow) {
        state.currentEditKey = '';
        record.onEdit?.(false, false);
        const source = getDataSource();
        if (source.length === 1) {
          const record = source[0];
          const valid = await record.onValid?.();
          if (!valid) {
            getDataSource().pop();
          }
        }
      }

      async function handleSave(record: EditRecordRow) {
        // 校验
        msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
        const valid = await record.onValid?.();
        if (valid) {
          try {
            // @ts-ignore
            let data: InsertOrUpdateFamilyForm = cloneDeep(record.editValueRefs);
            let succ = false;
            data.fmCandId = state.userInfo.userId;
            if (!!record.fmId) {
              data.fmId = record.fmId;
              succ = await updateFamily(data);
            } else {
              succ = await addFamily(data);
            }
            if (succ && (await record.onEdit?.(false, true))) {
              state.currentEditKey = '';
              msg.success({ content: '数据已保存', key: 'saving' });
            }
          } catch (error) {
            msg.error({ content: '保存失败', key: 'saving' });
          }
        } else {
          msg.error({ content: '请填写正确的数据', key: 'saving' });
        }
      }

      function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
        if (!record.editable) {
          return [
            {
              label: '编辑',
              disabled: state.currentEditKey ? state.currentEditKey !== record.key : false,
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              onClick: handleDel.bind(null, record),
            },
          ];
        }
        return [
          {
            label: '保存',
            onClick: handleSave.bind(null, record, column),
          },
          {
            label: '取消',
            popConfirm: {
              title: '是否取消编辑',
              confirm: handleCancel.bind(null, record, column),
            },
          },
        ];
      }

      async function handleDel(record: EditRecordRow) {
        if (await delFamily(record.fmId)) {
          deleteTableDataRecord(record.key);
          msg.success('操作成功');
        }
      }

      function onEditChange({ column, value, record }) {
        // 本例
        if (column.dataIndex === 'id') {
          record.editValueRefs.name4.value = `${value}`;
        }
        console.log(column, value, record);
      }
      const [tableRef, { getDataSource, deleteTableDataRecord }] = useTable({
        columns: fmColumns,
        api: () => listFamilies(state.userInfo.userId),
        autoCreateKey: true,
        showIndexColumn: true,
        pagination: false,
        canResize: false,
        actionColumn: {
          // width: 160,
          title: '操作',
          dataIndex: 'action',
          // slots: { customRender: 'action' },
        },
      });

      /** Edit Table end **/

      /** email modal */
      const [registerModal, { openModal }] = useModal();
      /** */

      return {
        ...toRefs(state),
        avatar,
        register,
        uploadApi: uploadApi as any,
        updateAvatar,
        createActions,
        onEditChange,
        tableRef,
        addFmRecord,

        registerModal,
        openModal,

        updateEmailSuccess,

        resetForm,
        handleUpdateInfo,

        uploadCandAvatar,
      };
    },
  });
</script>

<style lang="less" scoped></style>
