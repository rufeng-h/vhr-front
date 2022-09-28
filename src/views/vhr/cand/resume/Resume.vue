<template>
  <div>
    <PageWrapper>
      <div class="flex flex-row justify-start items-start">
        <!-- 左栏 Anchor -->
        <div class="w-7/30 bg-white p-3 rounded-md min-w-min">
          <div class="flex flex-row justify-start items-center">
            <a-avatar src="resource/img/logo.png" />
            <span class="text-lg ml-2">{{ resumeInfo.rsName }}</span>
          </div>
          <div class="mt-3 flex flex-row justify-between items-center">
            <a-rate :value="2" disabled />
            <span>{{ resumeInfo.rsCreated.substring(0, 10) }}</span>
          </div>
          <div class="mt-3 flex flex-row justify-between items-center">
            <a-tag color="skyblue">{{ resumeInfo.rsPublic ? '公开简历' : '私密简历' }}</a-tag>
            <a-tag color="orange" v-if="resumeInfo.rsDefault">默认简历</a-tag>
            <a-tag color="red">不可投递</a-tag>
          </div>
          <div class="mt-3 flex flex-row justify-between items-center">
            <a-button type="primary" preIcon="lucide:refresh-cw">刷 新</a-button>
            <a-button type="primary" preIcon="bytesize:eye">预 览</a-button>
          </div>
          <a-anchor class="mt-4" @click="handleAnchorClick">
            <a-anchor-link href="#base-info" title="基本信息" />
            <a-anchor-link href="#components-anchor-demo-static" title="Static demo" />
            <a-anchor-link
              href="#components-anchor-demo-basic"
              title="Basic demo with Target"
              target="_blank"
            />
            <a-anchor-link href="#API" title="API">
              <a-anchor-link href="#Anchor-Props" title="Anchor Props" />
              <a-anchor-link href="#Link-Props" title="Link Props" />
            </a-anchor-link>
          </a-anchor>
        </div>
        <!-- 右侧表单 -->
        <div class="w-4/5 h-full pl-3">
          <!-- 基本信息 -->
          <a-card hoverable title="基本信息" id="base-info">
            <div class="flex flex-row justify-start items-center">
              <div class="h-25">
                <a-image :src="userInfo.avatar" height="6.25rem" />
              </div>
              <div class="flex flex-col justify-between items-start ml-3 h-25">
                <!-- 头像姓名 -->
                <div flex flex-row justify="start items-center">
                  <span class="text-lg mr-3">{{ userInfo.username }}</span>
                  <a-tag color="green" style="font-size: 1rem"
                    ><Icon icon="arcticons:blizzard-authenticator" color="green" />已认证</a-tag
                  >
                </div>
                <!-- 性别、名族等 -->
                <div>
                  <Icon v-if="userInfo.gender === 'M'" icon="twemoji:male-sign" :size="15" />
                  <Icon v-else icon="twemoji:female-sign" :size="20" />
                  <span v-if="nation"
                    ><span style="color: #ccc">&nbsp;|&nbsp;</span>{{ nation }}</span
                  >
                  <span
                    ><span style="color: #ccc">&nbsp;|&nbsp;</span>{{ `${age}岁(${birth})` }}</span
                  >
                  <span v-if="politic"
                    ><span style="color: #ccc">&nbsp;|&nbsp;</span>{{ politic }}</span
                  >
                  <span v-if="living"
                    ><span style="color: #ccc">&nbsp;|&nbsp;</span>现居{{ living }}</span
                  >
                </div>
                <!-- 联系方式 -->
                <div class="text-sm">
                  <span v-if="userInfo.phone">
                    <Icon icon="akar-icons:phone" :size="15" />
                    {{ userInfo.phone }}
                    &nbsp;
                    <span style="color: #ccc">|</span>
                    &nbsp;
                  </span>
                  <span v-if="userInfo.email">
                    <Icon icon="fontisto:email" :size="15" />
                    {{ userInfo.email }}
                  </span>
                </div>
              </div>
            </div>
          </a-card>
          <!-- 个人优势 -->
          <Advantage v-model:adv="resumeInfo.adv" />
          <Education v-model:edus="resumeInfo.edus" />
          <WorkExpr v-model:workExprs="resumeInfo.workExprs" />
        </div>
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Anchor, Avatar, Card, Image, Rate, Tag } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useRoute } from 'vue-router';
  import { getResume } from '/@/api/vhr/resume/resume';
  import { CandidateInfo } from '/@/api/sys/model/userModel';
  import { ResumeInfo } from '/@/api/vhr/resume/model';
  import Icon from '/@/components/Icon';
  import { cityMap, countryMap, nationalities, politics } from '/@/const';
  import Advantage from './Advantage.vue';
  import Education from './Education.vue';
  import WorkExpr from './WorkExpr.vue';

  export default defineComponent({
    name: 'ResumePage',
    components: {
      PageWrapper,
      [Card.name]: Card,
      [Image.name]: Image,
      [Avatar.name]: Avatar,
      [Rate.name]: Rate,
      [Tag.name]: Tag,
      Icon,
      [Anchor.name]: Anchor,
      [Anchor.Link.name]: Anchor.Link,
      Advantage,
      Education,
      WorkExpr,
    },
    setup() {
      const router = useRoute();
      onMounted(async () => {
        state.resumeInfo = await getResume(parseInt(router.params.rsId as string));
      });
      const userStore = useUserStore();
      const state: { userInfo: CandidateInfo; resumeInfo: ResumeInfo } = reactive({
        userInfo: userStore.getUserInfo as CandidateInfo,
        resumeInfo: {
          rsId: 0,
          rsName: '',
          rsCandId: 0,
          rsCreated: '',
          rsDefault: false,
          rsDesc: '',
          rsModified: '',
          rsPublic: false,
          edus: [],
          workExprs: [],
        },
      });
      const tableRef = ref<{ getDataSource: () => any } | null>(null);

      // const [register, { validate }] = useForm({
      //   layout: 'vertical',
      //   baseColProps: {
      //     span: 6,
      //   },
      //   schemas: schemas,
      //   showActionButtonGroup: false,
      // });

      // const [registerTask, { validate: validateTaskForm }] = useForm({
      //   layout: 'vertical',
      //   baseColProps: {
      //     span: 6,
      //   },
      //   schemas: taskSchemas,
      //   showActionButtonGroup: false,
      // });

      // async function submitAll() {
      //   try {
      //     if (tableRef.value) {
      //       console.log('table data:', tableRef.value.getDataSource());
      //     }

      //     const [values, taskValues] = await Promise.all([validate(), validateTaskForm()]);
      //     console.log('form data:', values, taskValues);
      //   } catch (error) {}
      // }

      function handleAnchorClick(e) {
        e.preventDefault();
      }
      // setInterval(() => console.log(state.resumeInfo.edus), 2000);

      return {
        ...toRefs(state),
        tableRef,
        handleAnchorClick,
        nation: state.userInfo.nation ? nationalities[state.userInfo.nation] : null,
        politic: state.userInfo.politic ? politics[state.userInfo.politic] : null,
        age: new Date().getFullYear() - parseInt(state.userInfo.idCard.substring(6, 10)),
        birth:
          state.userInfo.idCard.substring(6, 10) + '-' + state.userInfo.idCard.substring(11, 13),
        living: state.userInfo.living
          ? cityMap[state.userInfo.living.substring(0, 4).padEnd(6, '0')].name +
            '/' +
            countryMap[state.userInfo.living].name
          : null,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-tag) {
    font-size: 1em !important;
  }

  :deep(.ant-anchor-link) {
    font-size: 1.05em;
  }

  :deep(div.ant-card:nth-child(n + 2)) {
    margin-top: 0.5rem;
  }

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
