<template>
  <div>
    <!--动态列表div-->
    <h2>&nbsp;&nbsp;动态 :&nbsp;)</h2>
    <a-list class="comment-list" item-layout="horizontal" :data-source="this.dynamicList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment :author="item.petName">
          <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /><!--后期头像可用后用item.postUserHeadPortraitUri替换-->
          <template slot="actions">
            <span key="comment-basic-like">
              <a-tooltip title="点赞">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like(index)" />
              </a-tooltip>
              <span style="padding-left: '8px'; cursor: 'auto';"> {{ item.tagsCount }}&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span key="comment-basic-reply-to"><a-icon type="message" />&nbsp;{{ item.commentsCount }}</span>
          </template>
          <p slot="content">
            {{ item.content }}
          </p>
          <a-tooltip slot="datetime" :title="item.createTime">
            <span>{{ item.createTime }}</span>
          </a-tooltip>
        </a-comment>
      </a-list-item>
    </a-list>
  </div>
</template>

<style>
p {
  font-size: 18px;
  line-height: 33px;
}
</style>

<script>
import axios from 'axios';
import moment from 'moment';
export default {
  data() {
    return {
      likes : 10,
      action : null,
      moment,
      dynamicList: [], //动态数据列表
      commentList: [], //评论列表
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
            console.log("dynamicList:" + response);
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

    //getCommentList(index) {
      //axios
        //.get('api/message/getComment', index)
        //.then(response => {
          //if (response.status == 200) {
            //this.commentList = response.data;
            //console.log("commentList:" + this.commentList);
          //}
        //})
        //.catch(error => {
          //console.log(error); //控制台打印异常
        //});
    //},

    like(index) {
      if (this.action === null || this.action === 'disliked') {
        this.action = 'liked';
      } else {
        this.action = 'disliked';
      }
    },
  },
};
</script>
