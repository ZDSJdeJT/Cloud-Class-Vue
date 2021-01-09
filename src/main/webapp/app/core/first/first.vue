<template>
  <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="this.dynamicList">
    <a-list-item slot="renderItem" key="item.postUserId" slot-scope="item">
      <template v-for="{ type, text } in actions" slot="actions">
        <span :key="type">
          <a-icon :type="type" style="margin-right: 8px;" />
          {{ text }}
        </span>
      </template>
      <a-list-item-meta :description="item.createTime">
        <a slot="title">{{ item.postUserId }}</a>
        <a-avatar slot="avatar" :src="item.avatar" />
      </a-list-item-meta>
      <h5>{{ item.content }}</h5>
    </a-list-item>
  </a-list>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  data() {
    return {
      actions: [
        { type: 'like-o', text: '156' },
        { type: 'message', text: '2' },
      ],
      dynamicList: [], //动态数据列表
    };
  },
  created() {
    this.getDynamicList();
  },
  methods: {
    getDynamicList() {
      axios
        .get('api/message/getDynamic')
        .then(response => {
          if (response.status == 200) {
            this.dynamicList = response.data;
            console.log(this.dynamicList);
            console.log(this.dynamicList.length);
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },
  },
};
</script>
