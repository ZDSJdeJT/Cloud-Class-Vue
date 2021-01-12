<template>
  <div>
    <!--动态列表div-->
    <h2 v-text="$t('first.title')"></h2>
    <a-button type="primary" @click="showModal" v-text="$t('first.releaseDynamic')" style="position: absolute; top: 1.3rem; left: 88%;">
    </a-button>
    <collection-create-form ref="collectionForm" :visible="visible" @cancel="handleCancel" @create="handleCreate" />
    <a-list class="comment-list" item-layout="horizontal" :data-source="this.dynamicList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-comment :author="item.petName">
          <!--动态-->
          <a-avatar slot="avatar" :src="item.postUserHeadPortraitUri" />
          <template slot="actions">
            <span key="comment-basic-like">
              <a-tooltip title="点赞" placement="bottom">
                <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" @click="like(index)" />
              </a-tooltip>
              <span style="padding-left: '8px'; cursor: 'auto';"> {{ item.tagsCount }}&nbsp;&nbsp;&nbsp;&nbsp; </span>
            </span>
            <span key="comment-basic-reply-to">
              <a-tooltip title="查看评论" placement="bottom"><a-icon type="message" @click="viewComments(index)" /></a-tooltip>&nbsp;{{
                item.commentsCount
              }}
            </span>
            <span v-if="canIChangeDynamic[index]">&nbsp;&nbsp;&nbsp;修改</span>
            <span>&nbsp;&nbsp;&nbsp;<font color="red">删除</font></span>
          </template>
          <p slot="content">
            <a :id="spliceId('dynamicContent', index)" class="dynamicStyle">{{ showPartOfDynamicContent(index) }}&nbsp;&nbsp;</a
            ><span key="view-dynamic-content-details">
              <a-tooltip placement="bottom" title="查看详情" v-if="isDynamicContentTooLong[index]"
                ><a-icon type="plus-circle" @click="viewDynamicContentDetails(index)" /></a-tooltip
              >&nbsp;<a-tooltip placement="right" title="收起详情" v-if="isDynamicContentTooLong[index]"
                ><a-icon type="minus-circle" @click="cancelViewDynamicContentDetails(index)"
              /></a-tooltip>
            </span>
          </p>
          <a-tooltip slot="datetime" :title="timeFormatConversion(item.createTime)">
            <span>{{ calculationTimeDifference(item.createTime) }}</span>
          </a-tooltip>
          <div :id="spliceId('dynamicComment', index)" hidden>
            <div>
                <a-avatar slot="avatar" class="space-align-block" align="start" :src="userHeadPort" />
                <a-textarea placeholder="发条友善的评论" class="space-align-container" align="center" allow-clear v-model="commentDynamicText"/>
                <a-botton type="primary" class="space-align-block" align="end" shape="circle" icon="export" @click="commentDynamic(item.id)"></a-botton>
              <a-comment v-for="commentOfDynamic in dynamicCommentList" :key="commentOfDynamic.id">
                <!--评论-->{{commentOfDynamic}}
                <span slot="actions">
                  <span key="comment-basic-like">
                    <a-tooltip title="点赞">
                      <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" />
                    </a-tooltip>
                    <span style="padding-left: '8px'; cursor: 'auto';"> 死数据&nbsp;&nbsp;&nbsp;&nbsp; </span>
                  </span>
                  <span slot="actions">回复</span>
                  <span>&nbsp;&nbsp;&nbsp;修改</span>
                  <span>&nbsp;&nbsp;&nbsp;<font color="red">删除</font></span>
                </span>
                <a slot="author">commentOfDynamic.petName</a>
                <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
                <p slot="content">
                  <a class="dynamicStyle"
                    >We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</a
                  >
                </p>
                <a-tooltip slot="datetime">
                  <span>时间</span>
                </a-tooltip>
                <a-comment>
                  <span slot="actions">
                    <span key="comment-basic-like">
                      <a-tooltip title="点赞">
                        <a-icon type="like" :theme="action === 'liked' ? 'filled' : 'outlined'" />
                      </a-tooltip>
                      <span style="padding-left: '8px'; cursor: 'auto';"> 死数据&nbsp;&nbsp;&nbsp;&nbsp; </span>
                    </span>
                    <span slot="actions">回复</span>
                    <span>&nbsp;&nbsp;&nbsp;修改</span>
                    <span>&nbsp;&nbsp;&nbsp;<font color="red">删除</font></span>
                  </span>
                  <a slot="author">Han Solo</a>
                  <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
                  <p slot="content">
                    <a class="dynamicStyle"
                      >We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).</a
                    >
                  </p>
                  <a-tooltip slot="datetime">
                    <span>时间</span>
                  </a-tooltip>
                </a-comment>
              </a-comment>

            </div>
          </div>
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

const CollectionCreateForm = {
  props: ['visible'],
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' });
  },
  template: `
    <a-modal
      :visible="visible"
      title='发布新的动态'
      okText='发布'
      cancelText='取消'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='内容'>
          <a-input
            type='textarea'
            v-decorator="[
              'contentOfReleaseDynamic',
              {
                rules: [{ required: true, message: '内容是必填项！' }],
              }
            ]"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  `,
};
export default {

  data() {
    return {
      queryDynamicInfo: {
        page : 0,
        stuID : this.getStuId()
      },
      isDynamicContentTooLong : [], //动态内容是否过长
      canIChangeDynamic : [], //是否可修改动态
      action : null,
      dynamicList : [], //动态数据列表
      dynamicCommentList : [], //动态评论列表
      visible: false,
      userHeadPort:sessionStorage.getItem('userHeadPort'),
      userID:sessionStorage.getItem('userID'),
      commentDynamicText:null
    };
  },
  components:{
    CollectionCreateForm
  },
  created() {
    this.getDynamicList();
    console.log(sessionStorage.getItem('user'));
  },
  methods: {
   
    getDynamicList() { //获取动态列表
      axios
        .get('api/message/getDynamic', {
          params : this.queryDynamicInfo
        })
        .then(response => {
          if (response.status == 200) {       
            for (let i = 0; i < response.data.length; i++) {
              this.dynamicList.push(response.data[i]);
            }
            this.init();
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

    init() { //初始化
    for (let i = 0; i < this.dynamicList.length; i++) {
      if (this.dynamicList[i].content.length > 250) { //内容过长
      this.isDynamicContentTooLong.push(true);
      } else { //内容不过长
      this.isDynamicContentTooLong.push(false);
      }
      if (this.dynamicList[i].postUserId == this.getStuId()) {
        this.canIChangeDynamic.push(true);
      } else {
        this.canIChangeDynamic.push(false);
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
            var list = [];
            for (let i = 0; i < response.data.length; i++) {
              list.push(response.data[i]);
            }
            list["index"] = index;
            this.dynamicCommentList.push(list);
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
    var dynamicContent = document.getElementById('dynamicContent' + index); 
    dynamicContent.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + this.dynamicList[index].content + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"; 
    },

    cancelViewDynamicContentDetails(index) { //取消查看动态内容详情
    var dynamicContent = document.getElementById('dynamicContent' + index); 
    dynamicContent.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + this.dynamicList[index].content.substr(0,250) + "......" + "&nbsp;&nbsp;"; 
    },

    showPartOfDynamicContent(index) { //展示部分动态内容（如果内容过长）
    if (this.dynamicList[index].content.length > 250) { //内容过长
    return "      " + this.dynamicList[index].content.substr(0,250) + "......";
    } else { //内容不过长
    return "      " + this.dynamicList[index].content;
    }
    },

    spliceId : function(str, index){ //拼接Id
    return str + index;
    },

    getStuId() {
    return this.$store.getters.account ? this.$store.getters.account.login : '';
    },

    viewComments(index) {
      var dynamicComment = document.getElementById('dynamicComment' + index); 
      if (this.dynamicList[index].commentsCount != 0) { //评论数不为0时   
         
        if (dynamicComment.hidden == true) { //展开评论
          this.getCommentList(index);
        } else { //合起评论
          for (let i = 0; i < this.dynamicCommentList.length; i++) {
            if (this.dynamicCommentList[i].index == index) {
              this.dynamicCommentList.splice(i, 1);
              break;
            }
        }
        }
      
      }
        dynamicComment.hidden = !dynamicComment.hidden; 
        console.log(this.dynamicCommentList)
    },

    doesDynamicCommentExist(index) {
      var res = false;
      debugger
      for (let i = 0; i < this.dynamicCommentList.length; i++) {
        if (this.dynamicCommentList[i].index == index) {
          res = true;
          break;
        }
      }
      return res;
    },

    getIndexOfDynamicCommentList(index) {
      var res = -1;
      for (let i = 0; i < this.dynamicCommentList.length; i++) {
        if (this.dynamicCommentList[i].index == index) {
          res = i;
          break;
        }
      }
      return res;
    },
   commentDynamic(dyID,index){
     console.log(this.commentDynamicText);
         axios.post('api/message/addComment',
        this.commentDynamicText,
        {
          headers: {'Content-Type': 'application/json' },
          params:{  
            postUserId:this.getStuId(),
            msID:dyID
          }
        }
          )
          .then(function (response) {
            this.getCommentList(index);
          })
          .catch(function (error) {
            console.log(error);
          });
   },

    showModal() {
      this.visible = true;
    },

    handleCancel() {
      this.visible = false;
    },

    handleCreate() {
      const form = this.$refs.collectionForm.form;
      form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log('Received values of form: ', values);       
        this.releaseDynamic(values.contentOfReleaseDynamic);
        form.resetFields();
        this.visible = false;
      });
    },

    releaseDynamic(contentOfReleaseDynamic) {
        axios.post('api/message/addDynamic',
        contentOfReleaseDynamic,
        {
          headers: {
      'Content-Type': 'application/json' 
    },
          params:{  postUserId:this.getStuId()}
        }
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  },
};
</script>
