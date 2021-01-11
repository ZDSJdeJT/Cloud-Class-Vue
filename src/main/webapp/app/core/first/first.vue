<template>
  <div>
    <!--动态列表div-->
    <h2>&nbsp;&nbsp;动态 :&nbsp;)</h2>
    <a-list class="comment-list" item-layout="horizontal" :data-source="this.dynamicList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment :author="item.petName">
          <a-avatar
            slot="avatar"
            :src="item.postUserHeadPortraitUri"
          />
          <template slot="actions">
            <span key="comment-basic-like">
              <a-tooltip title="点赞">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like(index)" />
              </a-tooltip>
              <span style="padding-left: '8px'; cursor: 'auto';"> {{ item.tagsCount }}&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span key="comment-basic-reply-to">
              <a-tooltip title="评论"><a-icon type="message" /></a-tooltip>&nbsp;{{ item.commentsCount }}
            </span>
          </template>
          <p slot="content">
            <a :id="spliceContentId(index)" class="dynamicStyle">{{ showPartOfDynamicContent(index) }}&nbsp;&nbsp;</a
            ><span key="view-dynamic-content-details">
              <a-tooltip placement="left" title="查看详情" v-if="isContentTooLong[index]"
                ><a-icon type="plus-circle" @click="viewDynamicContentDetails(index)" /></a-tooltip
              >&nbsp;<a-tooltip placement="right" title="收起详情" v-if="isContentTooLong[index]"
                ><a-icon type="minus-circle" @click="cancelViewDynamicContentDetails(index)"
              /></a-tooltip>
            </span>
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
.dynamicStyle {
  font-size: 18px;
}
p {
  line-height: 33px;
  margin-right: 4cm;
  margin-left: 0.3cm;
}
</style>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      queryDynamicInfo : {
        page : 0,
        stuID : this.getStuId()
      },
      isContentTooLong : [],
      action : null,
      dynamicList: [], //动态数据列表
      commentList: [], //评论列表
    };
  },
  created() {
    this.getDynamicList();
  },
  methods: {
    getDynamicList() { //获取动态列表
      axios
        .get('api/message/getDynamic', {
          params : this.queryDynamicInfo
        })
        .then(response => {
          if (response.status == 200) {
            this.dynamicList = response.data;
            this.init();
            for (let i = 0; i < this.dynamicList.length; i++) {
              this.getCommentList(i);
            }
            console.log("commentList:" + this.commentList);
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

    init() { //初始化
    for (let i = 0; i < this.dynamicList.length; i++) {
      if (this.dynamicList[i].content.length > 250) { //内容过长
      this.isContentTooLong.push(true);
      } else { //内容不过长
      this.isContentTooLong.push(false);
      }
    }
    },

    getCommentList(index) {
      axios
        .get('api/message/getComment', {
          params : {
            id : this.dynamicList[index].id,
            stuID : this.getStuId()
          }
        })
        .then(response => {
          if (response.status == 200) {
            var comment = response.data;
            this.commentList.push(comment);
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

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
    },

    viewDynamicContentDetails(index) { //查看动态内容详情
    var dynamicContent = document.getElementById('dynamicContent' +index); 
    dynamicContent.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + this.dynamicList[index].content + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; 
    },

    cancelViewDynamicContentDetails(index) { //取消查看动态内容详情
    var dynamicContent = document.getElementById('dynamicContent' +index); 
    dynamicContent.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + this.dynamicList[index].content.substr(0,250) + "......" + "&nbsp;&nbsp;"; 
    },

    showPartOfDynamicContent(index) { //展示部分动态内容（如果内容过长）
    if (this.dynamicList[index].content.length > 250) { //内容过长
    return "      " + this.dynamicList[index].content.substr(0,250) + "......";
    } else { //内容不过长
    return "      " + this.dynamicList[index].content;
    }
    },

    spliceContentId : function(index){ //拼接Id
    return "dynamicContent" + index;
    },

    getStuId() {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
    }
  },
};
</script>
