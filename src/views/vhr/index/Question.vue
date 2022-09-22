<template
  ><div class="2xl:w-5/6 xl:w-6/7 m-auto">
    <PageWrapper dense>
      <template #default>
        <CollapseContainer v-for="item in items" :key="item.title">
          <template #title>
            <div class="h-15 flex flex-row items-center">
              <Icon icon="akar-icons:chat-question" :size="40" />
              <span class="text-xl ml-2 font-仿宋">{{ item.title }}</span>
            </div>
          </template>
          <div class="content" v-html="item.answer"></div>
        </CollapseContainer>
      </template>
    </PageWrapper>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import Icon from '/@/components/Icon';
  import { CollapseContainer } from '/@/components/Container';
  import { List } from 'ant-design-vue';
  export default defineComponent({
    components: {
      PageWrapper,
      // [Collapse.name]: Collapse,
      // [Collapse.Panel.name]: Collapse.Panel,
      CollapseContainer,
      Icon,
      [List.name]: List,
      [List.Item.name]: List.Item,
      [List.Item.Meta.name]: List.Item.Meta,
    },
    setup() {
      const items = [
        {
          title: '对于应聘者常见问题的回答',
          answer:
            '<p style="font-size: 14px; line-height: 24px;">1.\n                            在注册用户时，当收到注册验证码后，点击注册按钮无反应，请查看当前页面是否有红色文字提醒，很多时候是因为您的密码不符合注册格式要求。<br>2.\n                            已确认的简历无法修改和删除。\xa0<br>2. 投递过岗位的简历经审核后可以从该岗位撤回。<br>3.\n                            忘记注册的邮箱或密码可以在忘记密码页面选择通过邮箱或身份证号来找回。<br>4.\n                            申请注销的帐号经审核通过后。将删除在本站注册的全部信息。<br>5.\n                            确认和投递简历前均有明确提示，请仔细核对相关信息，避免因个人疏忽影响应聘。<br>6.\n                            填写简历时如提示身份证号已被注册，多数是因为您遗忘了注册时的邮箱帐户，请在忘记密码页面通过身份证找回密码，同时系统会提示您注册的邮箱帐户。<br>7.\n                            使用QQ邮箱注册时请注意，前面不要使用www，有可能会接收不到激活邮件。或者在注册前使用其它邮箱给您要注册的邮箱发一封邮件，确认是否能够正常接收邮件。<br>8.\n                            对于系统使用中出现的问题，请截图并详细描述出现错误的步骤及使用的浏览器版本情况，发送邮件至<img src="./%E4%B8%AD%E5%9B%BD%E9%93%81%E8%B7%AF%E4%BA%BA%E6%89%8D%E6%8B%9B%E8%81%98%E7%BD%91_files/2021020306461612305996717005510.png" border="0"></p>',
        },
        {
          title: '投递简历时提示学历不符合要求怎么办？',
          answer:
            '<p style="font-size: 14px; line-height: 24px;">招聘信息中每个岗位对学历的要求和应聘者简历基本信息中的最高学历对应有以下几种情况：\n                            <br>1. 专科：要求学历只限专科 <br>2. 专科及以上：要求学历可以是专科/本科/硕士研究生/博士研究生\n                            <br>3. 本科：要求学历只限本科 <br>4. 本科及以上-要求学历可以是本科/硕士研究生/博士研究生 <br>5.\n                            硕士研究生-要求学历只限硕士研究生 <br>6. 硕士研究生及以上-要求学历可以是硕士研究生/博士研究生\n                            <br>7. 博士研究生-要求学历只限博士研究生 <br>8. 其他-不限学历 <br>请应聘者仔细查看拟投递岗位对学历的对应要求。\n                        </p>',
        },
        {
          title: '我的身份证号已经被注册了怎么办？',
          answer:
            '<p style="overflow-wrap: break-word; padding: 0px; margin-top: 0px; margin-bottom: 0px; border: 0px; color: #535353; font-size: 14px;">\n                            答：为保证应聘毕业生的权益，系统对身份证号码进行唯一性验证。如果身份证号被非本人注册，请联系所在学校开具本人确未在中国铁路人才招聘网注册过的证明文件，将您的姓名(文字)、身份证号(文字)、身份证正反面照片(图片)、手持身份证正面照片以及证明文件（扫描件或照片）发送至\n                            <img src="./%E4%B8%AD%E5%9B%BD%E9%93%81%E8%B7%AF%E4%BA%BA%E6%89%8D%E6%8B%9B%E8%81%98%E7%BD%91_files/2021020306461612305996717005510.png" border="0">\n                            ,标题为“申请注销被抢注身份证信息”。经工作人员审核确实属于非本人注册的情况后，将于3个工作日内将系统中的注册信息予以删除。\n                        </p><p style="overflow-wrap: break-word; padding: 0px; margin-top: 0px; margin-bottom: 0px; border: 0px; color: #535353; font-size: 14px;">\n                            <span style="overflow-wrap: break-word;"> \xa0 </span></p><p style="overflow-wrap: break-word; padding: 0px; margin-top: 0px; margin-bottom: 0px; border: 0px; color: #535353; font-size: 14px;">\n                            另:为避免干扰正常招聘工作，自2015年12月1日起，申请用户注销只限非本人注册的情况，请广大毕业生在简历确认前仔细核对个人信息，谨慎选择投递岗位，不符合要求的申请将不予处理和回复。</p><p>\xa0</p>',
        },
        {
          title: '简历确认后为什么不能进行修改？',
          answer:
            '<p><span style="font-size: 14px;">答：在简历投递期间，招聘单位会在网上进行审核，如您对简历进行了修改，会造成与招聘单位审核时的信息不一致，影响招聘工作的正常进行，因此请您在投递简历前仔细核对信息的正确性和完整性后再进行确认。</span>\n                    </p>',
        },
        {
          title: '简历下载后与本人信息不符怎么办？',
          answer:
            '<p><span style="font-size: 14px;">答：不要使用迅雷等下载工具，请使用浏览器自带的下载方式下载。如360浏览器下载设置里选择默认下载工具请设置为“使用内建下载”。</span>\n                    </p>',
        },
        {
          title: '如何使用本系统参加应聘？',
          answer:
            '<p style="FONT-SIZE: 14px">\n                        一、如果您选择的招聘信息要求“登录中国铁路人才招聘网(https://rczp.china-railway.com.cn)实名注册后进行网上报名”，请参考下面使用流程：<br>\n                    </p><p><span style="FONT-SIZE: 14px">1. 用户注册/登录</span></p><p><span style="FONT-SIZE: 14px">\xa0 请填写准确信息，牢记您的登录邮箱名和密码。</span></p><p><span style="FONT-SIZE: 14px">2. 按步骤填写简历</span></p><p><span style="FONT-SIZE: 14px">\xa0 建议使用IE或谷歌浏览器，以免造成图片上传后无法保存等现象。</span>\n                        </p><p><span style="FONT-SIZE: 14px">3. 确认简历</span></p><p><span style="FONT-SIZE: 14px">\xa0 注意简历确认后将无法再进行修改，预览简历页面会显示您的全部简历信息，请仔细核对，准确无误后再确认。</span>\n                        </p><p><span style="FONT-SIZE: 14px">4. 投递简历</span></p><p><span style="FONT-SIZE: 14px">\xa0 打开您要应聘的单位发布的招聘公告，详细阅读招聘信息，选择页面下方的招聘岗位，展开并阅读招聘的岗位信息，点击“我要投简历”。</span>\n                        </p><p><span style="FONT-SIZE: 14px">\xa0 投递前<span style="LINE-HEIGHT: 24px; FONT-SIZE: 14px">请您仔细阅读公告并按规定的限制数量进行投递，简历投递后不能撤回。</span></span>\n                        </p><p><span style="LINE-HEIGHT: 24px; FONT-SIZE: 14px"><br></span></p><p><span style="LINE-HEIGHT: 24px; FONT-SIZE: 14px">二、部分招聘公告需要到指定招聘网站报名，具体操作流程请参阅各招聘网站。</span>\n                        </p>',
        },
        {
          title: '请问我的生源地在完善个人简历时无法选择，我应该如何填写？',
          answer:
            '<p><span style="font-size: 14px;"> <span style="color: #535353; font-size: 14px;"> 答：请将您的生源地按省、市、区发送至 <img src="./%E4%B8%AD%E5%9B%BD%E9%93%81%E8%B7%AF%E4%BA%BA%E6%89%8D%E6%8B%9B%E8%81%98%E7%BD%91_files/2021020306461612305996717005510.png" border="0"> </span> <span style="color: #535353; font-size: 14px;"> ，我们核实后将予以添加。 </span> </span></p>',
        },
        {
          title: '《毕业生应聘登记表》在哪里下载？',
          answer:
            '<p><span style="font-size: 14px;">答：登录“个人中心”，选择左侧“我的工作申请”，在对应的申请岗位点击简历名称进行下载。</span>\n                        </p>',
        },
        {
          title: '注册时没有收到激活邮件怎么办？',
          answer:
            '<p style="font-size: 14px; line-height: 24px;">\n                            答：邮箱是找回密码和接收招聘单位通知的主要方式。<br>1. 确定您的注册邮箱名称完整、准确，能够正常接收邮件。\n                        </p><p style="font-size: 14px; line-height: 24px;">2. 查看邮件是否被邮箱拦截过滤了。<br><br><br></p><p>\xa0</p>',
        },
        {
          title: '简历保存后如何进行修改？',
          answer:
            '<p style="line-height:37px"><span style="font-size: 14px; ">答：要修改保存后的简历，前提是没有操作最后一步进行确认<span style="font-size: 14px; line-height: 37px;">简历</span>，如<span style="color: rgb(255, 0, 0); font-size: 14px; line-height: 37px;">简历确认后将无法修改，请谨慎确认。</span>修改方法：登录后点击主页右上角的个人中心，然后在左侧我的简历栏目中对各项内容进行修改完善。</span>\n                    </p>',
        },
        {
          title: '简历填写的一般要求是什么？',
          answer:
            '<p><span style="font-size: 14px; ">答：请关注简历填写页面顶部的提示项，并按照提示要求进行填写，各项技能及奖励请按照重要性逐一填写，一般不超过3项。带*号的为必填项。</span>\n                    </p><p><br></p>',
        },
        {
          title: '简历填写时搜索不到自己的学校怎么办？',
          answer:
            '<p><span style="font-size: 14px; ">答：为保证院校名称的统一性，一般请通过搜索方式填写院校名称。如果找不到自己的学校，可以点击添加，自行填写院校名称。</span>\n                    </p><p><span style="font-size: 14px; ">示例：</span></p><p><strong><span style="font-size: 10.5pt; "><img src="./%E4%B8%AD%E5%9B%BD%E9%93%81%E8%B7%AF%E4%BA%BA%E6%89%8D%E6%8B%9B%E8%81%98%E7%BD%911_files/2015091200551441990525552095709.png" title="2015091200551441990525552095709.png" alt="QQ图片20150912005446.png"></span></strong></p>',
        },
        {
          title: '为何我的照片无法上传？',
          answer:
            '<p style="line-height:37px">\n                        <span style="font-size: 14px; ">答：请将照片保存为jpg格式，尺寸为240*320像素，不超过100k即可。如均符合要求后仍不能上传，建议更换电脑进行操作。</span>\n                    </p>',
        },
      ];

      return {
        items,
      };
    },
  });
</script>

<style scoped lang="less">
  .content {
    font-family: 仿宋;
  }
</style>
