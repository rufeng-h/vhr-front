<template>
  <div class="relative">
    <PageWrapper dense>
      <img :src="curImg" @click="handleClick(curImg)" />
      <div
        @click="prev"
        class="w-10 h-10 bg-gray-300 bg-opacity-40 text-center text-xl absolute left-0 top-2/5 leading-10 rounded-r-2/3"
        >&lt;</div
      >
      <div
        @click="next"
        class="w-10 h-10 bg-gray-300 bg-opacity-40 text-center text-xl absolute right-0 top-2/5 leading-10 rounded-l-2/3"
        >&gt;</div
      ></PageWrapper
    >
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { createImgPreview } from '/@/components/Preview/index';
  import { PageWrapper } from '/@/components/Page';
  import { useAppStore } from '/@/store/modules/app';
  import { handler } from '/@/layouts/default/setting/handler';
  import { HandlerEnum } from '/@/layouts/default/setting/enum';
  const imgList: string[] = [
    'resource/img/banner1.png',
    'resource/img/banner2.png',
    'resource/img/banner3.png',
    'resource/img/banner4.png',
  ];
  export default defineComponent({
    components: {
      PageWrapper,
    },
    setup() {
      let curIdx = 0;
      const state = reactive({
        curImg: imgList[curIdx],
      });
      function handleClick(img: string) {
        createImgPreview({ imageList: [img] });
      }

      function handlePreview() {
        createImgPreview({ imageList: imgList });
      }

      let interval;

      function resetInterval() {
        clearInterval(interval);
        interval = setInterval(() => {
          curIdx = (curIdx + 1) % imgList.length;
          state.curImg = imgList[curIdx];
        }, 3000);
      }

      function prev() {
        curIdx = curIdx === 0 ? imgList.length - 1 : (curIdx - 1) % imgList.length;
        state.curImg = imgList[curIdx];
        resetInterval();
      }

      function next() {
        curIdx = (curIdx + 1) % imgList.length;
        state.curImg = imgList[curIdx];
        resetInterval();
      }

      // resetInterval();

      // const appStore = useAppStore();
      // const config = handler(HandlerEnum.CHANGE_LAYOUT, {
      //   mode: 'inline',
      //   split: false,
      //   type: 'sidebar',
      // });
      // console.log(config);

      // setTimeout(() => appStore.setProjectConfig(config), 3000);

      return { imgList, handleClick, handlePreview, ...toRefs(state), next, prev };
    },
  });
</script>
