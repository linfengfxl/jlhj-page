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
      deptId: this.value
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
    }
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
      /*this.reset();*/
    }/*,*/
    /*    reset(){
              Object.assign(this.data,{
              materId:'',
              materName:'',
              spec:'',
              model:'',
              quantity:'',
              texture:'',
              unit:'',
              price:'',
              amount:'',
              remark:'',
            });
        }*/
  }
}
</script>

<style>
</style>

