import { DemoOptionsItem } from '/@/api/demo/model/optionsModel';
import { FormSchema } from '/@/components/Form/index';
import { area, cityMap, nationalities, politics, provinceMap } from '/@/const';

export interface ListItem {
  key: string;
  title: string;
  description: string;
  extra?: string;
  avatar?: string;
  color?: string;
}

// tab的list
export const settingList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '安全设置',
    component: 'SecureSetting',
  },
  {
    key: '3',
    name: '账号绑定',
    component: 'AccountBind',
  },
  {
    key: '4',
    name: '新消息通知',
    component: 'MsgNotify',
  },
];

const provinceOptions = area.map((item) => {
  return { value: item.code, label: item.name };
});
const politicOpts: DemoOptionsItem[] = [];
for (let i = 0; i < politics.length; i++) {
  politicOpts.push({ label: politics[i], value: i.toString() });
}
const nationalityOpts: DemoOptionsItem[] = [];
for (let i = 0; i < nationalities.length; i++) {
  nationalityOpts.push({ label: nationalities[i], value: i.toString() });
}

// 基础设置 form
export const baseSetschemas: FormSchema[] = [
  {
    required: true,
    field: 'username',
    component: 'Input',
    label: '姓  名',
    colProps: {
      span: 11,
    },
  },
  {
    required: true,

    field: 'idCard',
    component: 'Input',
    label: '身份证号',
    componentProps: {
      disabled: true,
    },
    colProps: {
      span: 11,
    },
  },
  {
    required: true,

    field: 'email',
    component: 'Input',
    label: '邮  箱',
    slot: 'email',
    colProps: {
      span: 11,
    },
  },

  {
    required: true,

    field: 'phone',
    component: 'Input',
    label: '联系电话',
    slot: 'phone',
    colProps: {
      span: 11,
    },
  },
  {
    field: 'hometown0',
    component: 'Select',
    required: true,
    label: '籍  贯',
    colProps: {
      span: 5,
    },
    componentProps: ({ formModel, formActionType }) => {
      return {
        options: provinceOptions,
        onChange(e) {
          const { updateSchema, setFieldsValue } = formActionType;
          const options = provinceMap[e].children.map((item) => {
            return {
              label: item.name,
              value: item.code,
            };
          });
          setFieldsValue({ hometown1: undefined, hometown: undefined });
          updateSchema({
            field: 'hometown1',
            componentProps: {
              options,
              onChange(e) {
                const options = cityMap[e].children.map((item) => {
                  return {
                    label: item.name,
                    value: item.code,
                  };
                });
                formModel.hometown = undefined;
                const { updateSchema } = formActionType;
                updateSchema({
                  field: 'hometown',
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
            field: 'hometown',
            componentProps: {
              options: [],
            },
          });
        },
      };
    },
  },
  {
    field: 'hometown1',
    required: true,
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    labelWidth: 0,
  },
  {
    field: 'hometown',
    required: true,
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    labelWidth: 0,
  },
  {
    field: 'living0',
    required: true,
    component: 'Select',
    label: '现居地',
    colProps: {
      span: 5,
    },
    componentProps: ({ formModel, formActionType }) => {
      return {
        options: provinceOptions,
        onChange(e) {
          const { updateSchema, setFieldsValue } = formActionType;
          const options = provinceMap[e].children.map((item) => {
            return {
              label: item.name,
              value: item.code,
            };
          });
          setFieldsValue({ living1: undefined, living: undefined });
          updateSchema({
            field: 'living1',
            componentProps: {
              options,
              onChange(e) {
                const options = cityMap[e].children.map((item) => {
                  return {
                    label: item.name,
                    value: item.code,
                  };
                });
                formModel.living = undefined;
                const { updateSchema } = formActionType;
                updateSchema({
                  field: 'living',
                  componentProps: {
                    options,
                  },
                });
              },
            },
          });
        },
      };
    },
  },
  {
    field: 'living1',
    required: true,
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    componentProps: {
      options: [],
    },
    labelWidth: 0,
  },
  {
    field: 'living',
    required: true,
    component: 'Select',
    label: '',
    colProps: {
      span: 3,
    },
    componentProps: {
      options: [],
    },
    labelWidth: 0,
  },
  {
    required: true,
    field: 'nation',
    component: 'Select',
    label: '民 族',
    componentProps: {
      options: nationalityOpts,
    },
    colProps: {
      span: 11,
    },
  },
  {
    required: true,
    field: 'politic',
    component: 'Select',
    label: '政治面貌',
    componentProps: {
      options: politicOpts,
    },
    colProps: {
      span: 11,
    },
  },
  {
    field: 'height',
    component: 'InputNumber',
    label: '身高',
    suffix: 'CM',
    componentProps: {
      min: 0,
      max: 250,
    },
    colProps: {
      span: 11,
    },
  },
  {
    field: 'heavy',
    component: 'InputNumber',
    label: '体重',
    suffix: 'KG',
    componentProps: {
      min: 0,
      max: 250,
    },
    colProps: {
      span: 11,
    },
  },
  {
    field: 'visionLeft',
    component: 'InputNumber',
    label: '左眼视力',
    helpMessage: '标准对数记录',
    componentProps: {
      min: 4.0,
      max: 5.5,
    },
    colProps: {
      span: 11,
    },
  },
  {
    field: 'visionRight',
    component: 'InputNumber',
    label: '右眼视力',
    componentProps: {
      min: 4.0,
      max: 5.5,
    },
    colProps: {
      span: 11,
    },
  },
];

// 安全设置 list
export const secureSettingList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '当前密码强度：：强',
    extra: '修改',
  },
  {
    key: '2',
    title: '密保手机',
    description: '已绑定手机：：138****8293',
    extra: '修改',
  },
  {
    key: '3',
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    extra: '修改',
  },
  {
    key: '4',
    title: '备用邮箱',
    description: '已绑定邮箱：：ant***sign.com',
    extra: '修改',
  },
  {
    key: '5',
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    extra: '修改',
  },
];

// 账号绑定 list
export const accountBindList: ListItem[] = [
  {
    key: '1',
    title: '绑定淘宝',
    description: '当前未绑定淘宝账号',
    extra: '绑定',
    avatar: 'ri:taobao-fill',
    color: '#ff4000',
  },
  {
    key: '2',
    title: '绑定支付宝',
    description: '当前未绑定支付宝账号',
    extra: '绑定',
    avatar: 'fa-brands:alipay',
    color: '#2eabff',
  },
  {
    key: '3',
    title: '绑定钉钉',
    description: '当前未绑定钉钉账号',
    extra: '绑定',
    avatar: 'ri:dingding-fill',
    color: '#2eabff',
  },
];

// 新消息通知 list
export const msgNotifyList: ListItem[] = [
  {
    key: '1',
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
  },
  {
    key: '2',
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
  },
  {
    key: '3',
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
  },
];
