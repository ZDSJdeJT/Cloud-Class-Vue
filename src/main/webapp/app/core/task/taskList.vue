 
<template>
  <a-list item-layout="vertical" size="large" :data-source="this.taskList">
    <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
      <a-list-item-meta :description="timeFormatConversion(item.createTime) + '--' + timeFormatConversion(item.cutTime)">
        <a slot="title" :href="item.href" @click="openDetail(item.id)">{{ item.title }}</a>
        <a-avatar slot="avatar" :src="item.postUserHeadPortraitUri" />
      </a-list-item-meta>
      {{ item.content }}
    </a-list-item>
  </a-list>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      taskList: [],
    };
  },
  created() {
      this.init()
  },
  methods: {
      init() {
          this.getTaskList();
      },

      getTaskList() {
        axios
        .get('api/message/getAllTask')
        .then(response => {
          if (response.status == 200 && typeof response.data != "undefined") {
            this.taskList = response.data;
            console.log(this.taskList)
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
      },

    timeFormatConversion(date) {
      //时间格式转化方法
      var json_date = new Date(date).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },

    openDetail(id) {
        this.$router.push({name: 'TaskDetail', params: {taskId: id}});
    }
  }
};
</script>