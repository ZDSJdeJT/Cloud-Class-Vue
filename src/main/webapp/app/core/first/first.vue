<template>
  <div>
    <!--动态列表div-->
    <h2>&nbsp;&nbsp;动态 :&nbsp;)</h2>
    <a-list class="comment-list" item-layout="horizontal" :data-source="this.dynamicList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment :author="item.petName">
          <a-avatar
            slot="avatar"
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          /><!--后期头像可用后用item.postUserHeadPortraitUri替换-->
          <template slot="actions">
            <span key="comment-basic-like">
              <a-tooltip title="点赞">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like(index)" />
              </a-tooltip>
              <span style="padding-left: '8px'; cursor: 'auto';"> {{ item.tagsCount }}&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span key="comment-basic-reply-to"
              ><a-tooltip title="评论"><a-icon type="message" /></a-tooltip>&nbsp;{{ item.commentsCount }}</span
            >
          </template>
          <p slot="content">
            {{ item.content }}
          </p>
          <a-tooltip slot="datetime" :title="timeFormatConversion(item.createTime)">
            <span>{{ calculationTimeDifference(item.createTime) }}</span>
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
export default {
  data() {
    return {
      isContentTooLong : [],
      action : null,
      dynamicList: [], //动态数据列表
      commentList: [], //评论列表
    };
  },
  created() {
    this.getDynamicList();
    this.init();
  },
  methods: {
    getDynamicList() { //获取动态列表
      axios
        .get('api/message/getDynamic')
        .then(response => {
          if (response.status == 200) {
            this.dynamicList = response.data;
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

    init() { //初始化
    for (i = 0; i < this.dynamicList.length; i++) {
      if (this.dynamicList[i].content.length > 210) { //内容过长

      } else { //内容不过长

      }
    }
    },

/*     getCommentList(index) {
      axios
        .get('api/message/getComment', index)
        .then(response => {
          if (response.status == 200) {
            this.commentList = response.data;
            console.log("commentList:" + this.commentList);
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    }, */

    like(index) { //点赞方法
      if (this.action === null || this.action === 'disliked') {
        this.action = 'liked';
      } else {
        this.action = 'disliked';
      }
    },

    timeFormatConversion(date) {  //时间格式转化方法
    var json_date = new Date(date).toJSON();
    return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
    },

    calculationTimeDifference(date) { //计算发布时间至今多久
    //unix时间戳
    var unixTimeStamp = new Date("1970-01-01 08:00:00".replace(/-/g,"/"));
    //创建时间时间戳
    var creatTimeStamp = new Date(this.timeFormatConversion(date).replace(/-/g,"/"));
    //当前时间戳
    var newDate = new Date();
    var currentTimeStamp = new Date(newDate.getTime());  
    var timeDifference = parseInt((currentTimeStamp - (creatTimeStamp - unixTimeStamp)) / 1000); //换算为秒数
    if (timeDifference <= 60) {
      return "刚刚发布了...";
    } else if (timeDifference > 60 && timeDifference < 3600) {
      return ((parseInt(timeDifference / 60)) + "分钟前发布了...");
    } else if (timeDifference >= 3600 && timeDifference < 86400) {
      return ((parseInt(timeDifference / 60 / 60)) + "小时前发布了...");
    } else if (timeDifference >= 86400 && timeDifference < 604800) {
      return ((parseInt(timeDifference / 60 / 60 / 24)) + "天前发布了...");
    } else if (timeDifference >= 604800 && timeDifference < 2592000) {
      return ((parseInt(timeDifference / 60 / 60 / 24 / 7)) + "周前发布了...");
    } else if (timeDifference >= 2592000 && timeDifference < 31104000) {
      return ((parseInt(timeDifference / 60 / 60 / 24 / 30)) + "月前发布了...");
    } else if (timeDifference >= 31104000) {
      return ((parseInt(timeDifference / 60 / 60 / 24 / 30 / 12)) + "年前发布了...");
    }
    }
  },
};
</script>
