<template>
  <Select v-model="deptId" placeholder="部门" @on-change="switStorage">
    <Option
      v-for="(item,index) in storage"
      :value="item.deptId"
      :key="index"
    >{{ item.deptPathName }}</Option>
  </Select>
</template>

<script>  

export default {
  components: {

  },
  props: {
    value: {
      type: String,
      default: ''
    },
    model: {
      type: Object,
      default: null
    },
    text: {
      type: String,
      default: ''
    },
    // 控件显示文本对应 model 属性
    textProp: {
      type: String,
      default: "deptName"
    },
    auth: {
      type: Number,
      default: 1
    },
    init: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      storage: [],
      deptId: this.value,
    };
  },
  mounted() {
    this.load();
  },
  computed: {

  },
  watch: {
    value(val, old) {
      if (val != this.deptId) {
        this.deptId = val;
      }
      if (val != old) {
        this.$emit('on-change');
      }
    },
  },
  methods: {
    load() {
      this.$http.post("/api/engine/dept/select", {}).then((res) => {
        if (res.data.code === 0) {
          var data = res.data.data;
          this.storage = data;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.$Message.error("请求失败，请重新发送")
      });
    },
    switStorage() {
      this.$emit('input', this.deptId);
      var row = null;
      this.storage.map(item => {
        if (item.deptId == this.deptId) {
          row = item;
        }
      });
      if (row && this.model){
        this.model[this.textProp]=row.deptName;
      }
      this.$emit('on-select', row);
    }
  }
}
</script>

<style>
</style>

