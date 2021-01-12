<template>
  <div>
    <h2 v-text="$t('task.title')"></h2>
    <a-avatar shape="square" size="large" :src="taskData.postUserHeadPortraitUri" /><a>&nbsp;&nbsp;{{ taskData.petName }}</a>
    <h4>{{ taskData.title }}</h4>
    <h5>{{ taskData.content }}</h5>
    <h5>
      {{ timeFormatConversion(taskData.createTime) }} ---- <font color="#FF0000">{{ timeFormatConversion(taskData.cutTime) }}</font>
    </h5>
    <br /><br /><br /><br />
    <input type="file" id="fileExport" @change="handleFileChange" ref="inputer" />
    <button @click="upload()">上传</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      id: null,
      taskData: {"postUserHeadPortraitUri": ""},
      file: null,
      formData: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.id = this.$route.params.taskId;
      this.getTaskById();
    },

    getTaskById() {
      axios
        .get('api/message/getTaskByID', {
          params : {
            msID: this.id,
            stuID : this.getStuId()
          }
        })
        .then(response => {
          if (response.status == 200 && typeof response.data != "undefined") {
            this.taskData = response.data;
            console.log(this.taskData)
          }
        })
        .catch(error => {
          console.log(error); //控制台打印异常
        });
    },

    getStuId() {
      return this.$store.getters.account ? this.$store.getters.account.login : "";
    },

    timeFormatConversion(date) {
      //时间格式转化方法
      var json_date = new Date(date).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },

    upload() {
      if (this.formData != null) {
              axios
        .post("/api/message/upTask", this.formData, {
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
          params: {
            stuID: this.getStuId(),
            taskID: this.id,
            //taskText: this.form.getFieldValue('mark'),
          },
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        alert("请先添加作业文件！")
      }
    },

    handleFileChange (e) {
　　　let inputDOM = this.$refs.inputer;
　　　this.file = inputDOM.files[0];// 通过DOM取文件数据
　　　let size = Math.floor(this.file.size / 1024);//计算文件的大小　
　　　this.formData=new FormData();//new一个formData事件
　　　this.formData.append("file",this.file); //将file属性添加到formData里
　　　//此时formData就是我们要向后台传的参数了
　　}
  }
};
</script>