<template>
  <div>
    <h2 v-text="$t('task.title')"></h2>
    <a-list bordered :data-source="data">
      <a-list-item slot="renderItem" slot-scope="item, index">
        {{ item }}
      </a-list-item>
      <div slot="header">
        Header
      </div>
      <div slot="footer">
        Footer
      </div>
    </a-list>
  </div>
</template>
<script>
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

export default {
  data() {
    return {
      data,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      var task = this.$route.params.task;
      alert(task)
    }
  }
};
</script>