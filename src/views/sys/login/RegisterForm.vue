<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="validateRule" ref="formRef">
      <FormItem name="username" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.username"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem name="idCard" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.idCard"
          placeholder="身份证号"
        />
      </FormItem>
      <FormItem name="phone" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.phone"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="email" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.email"
          placeholder="邮箱"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem name="emailCode" class="enter-x">
        <CountdownInput
          :sendCodeApi="handleSendEmailCode"
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.emailCode"
          placeholder="邮箱验证码"
        />
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, LoginStateEnum } from './useLogin';
  import type { Rule } from 'ant-design-vue/es/form';
  import { validateEmail, sendEmailCode, register } from '/@/api/sys/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRedo } from '/@/hooks/web/usePage';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState } = useLoginState();

  const formRef = ref();
  const loading = ref(false);

  const { createMessage } = useMessage();
  const redo = useRedo();

  const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: '',
    idCard: '',
    emailCode: '',
    policy: false,
  });

  const emailValidator = async (_, value) => {
    // if (!/^1(3\\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\\d|9[0-35-9])\\d{8}$/.test(value)) {
    if (!/^[_A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
      return Promise.reject('邮箱格式不正确!');
    }
    return (await validateEmail(value)) ? Promise.reject('邮箱已存在!') : Promise.resolve();
  };

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);
  const validateRule: Record<string, Rule[]> = {
    username: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'blur',
      },
    ],
    idCard: [
      {
        required: true,
        pattern:
          /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[\dXx]$/,
        message: '身份证号格式不正确',
        trigger: 'blur',
      },
    ],
    phone: [
      {
        required: true,
        pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
        message: '手机号格式不正确',
        trigger: 'blur',
      },
    ],
    email: [
      {
        required: true,
        pattern: /^[_A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        message: '请输入正确的邮箱',
        trigger: 'blur',
      },
    ],
    password: [{ required: true, trigger: 'change', message: '请输入密码' }],
    confirmPassword: [
      {
        required: true,
        trigger: 'change',
        message: '密码输入不一致',
        validator: async (_, value) => {
          if (value !== formData.password) {
            return Promise.reject('密码不一致!');
          }
          return Promise.resolve();
        },
      },
    ],
    emailCode: [
      {
        required: true,
        trigger: 'blur',
        message: '请输入验证码',
      },
    ],
    policy: [
      {
        required: true,
        validator: async (_, value) => {
          return !!value ? Promise.resolve() : Promise.reject('请勾选政策协议!');
        },
        message: '请勾选政策协议!',
      },
    ],
  };

  async function handleRegister() {
    await formRef.value.validate();
    await register(formData);
    createMessage.success('注册成功，即将跳转到登录页面', 2);
    setTimeout(() => redo(), 2000);
  }

  async function handleSendEmailCode() {
    try {
      await emailValidator(null, formData.email);
    } catch (e) {
      createMessage.error(e as string);
      return Promise.resolve(false);
    }
    await sendEmailCode({
      userType: 'CANDIDATE',
      email: formData.email,
    });
    return Promise.resolve(true);
  }
</script>
