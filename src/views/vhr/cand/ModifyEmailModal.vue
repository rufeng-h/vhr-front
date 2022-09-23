<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="修改个人邮箱"
    @ok="handleSubmit"
    :height="100"
    :min-height="100"
    :can-fullscreen="false"
    centered
  >
    <BasicForm @register="registerForm">
      <template #code="{ model, field }">
        <CountdownInput
          :sendCodeApi="handleSendEmailCode"
          class="fix-auto-fill"
          v-model:value="model[field]"
          placeholder="邮箱验证码"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { CountdownInput } from '/@/components/CountDown';
  import { sendEmailCode, validateEmail } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { UpdateCandEmailForm } from '/@/api/vhr/cand/model';
  import { updateCandEmail } from '/@/api/vhr/cand/candidate';
  const emailValidator = async (_, value) => {
    // if (!/^1(3\\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$/.test(value)) {
    if (!/^[_A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      return Promise.reject('邮箱格式不正确!');
    }
    return (await validateEmail(value)) ? Promise.reject('邮箱已存在!') : Promise.resolve();
  };
  const { createMessage } = useMessage();
  export default defineComponent({
    name: 'UserModal',
    components: { BasicModal, BasicForm, CountdownInput },
    emits: ['register', 'success'],
    setup(_, { emit }) {
      const schemas: FormSchema[] = [
        {
          field: 'email',
          label: '邮箱',
          component: 'Input',
          required: true,
          rules: [
            {
              trigger: 'blur',
              pattern: /^[_A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '请输入正确的邮箱',
            },
          ],
          colProps: {
            span: 19,
          },
        },
        {
          field: 'code',
          slot: 'code',
          component: 'Input',
          label: '验证码',
          required: true,
        },
      ];

      const [registerForm, { validate, getFieldsValue }] = useForm({
        labelWidth: 80,
        schemas,
        showActionButtonGroup: false,
      });

      const [registerModal, { closeModal }] = useModalInner();
      async function handleSubmit() {
        const values = await validate();
        if (await updateCandEmail(values as UpdateCandEmailForm)) {
          emit('success', values.email);
          closeModal();
        }
      }

      async function handleSendEmailCode() {
        const email = getFieldsValue().email;
        try {
          await emailValidator(null, email);
        } catch (e) {
          createMessage.error(e as string);
          return Promise.resolve(false);
        }
        await sendEmailCode({
          userType: 'CANDIDATE',
          email,
        });
        return Promise.resolve(true);
      }

      return { registerForm, handleSubmit, registerModal, handleSendEmailCode };
    },
  });
</script>
