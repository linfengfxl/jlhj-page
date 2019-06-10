<template>
  <!-- 选择供应商 -->
  <div class="page-form-select">
    <Input
      v-model="text"
      readonly="readonly"
      :placeholder="placeholder"
      icon="search"
      @on-click="selectWorkload"
    ></Input>
    <selectWorkload ref="selectWorkload" :projectCode="projectCode"></selectWorkload>
  </div>
</template>

<script>  
import selectWorkload from '@/components/project/workload/SelectWorkload'

export default {
  components: {
    selectWorkload
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    projectCode: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    // 控件显示文本对应 model 属性
    textProp: {
      type: String,
      default: "projectCode"
    },
    placeholder: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      providerCode: '',
      providerName: ''
    };
  },
  mounted() {

  },
  computed: {

  },
  watch: {
    value(val, old) {
      this.projectCode = val;
    },
    text(val, old) {
      this.providerName = val;
    }
  },
  methods: {
    selectWorkload(row) {
      var sel = this.$refs.selectWorkload;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input', data.projectCode);
            this.$emit('on-select', data);
          }
        }
      });
    },
  }
}
</script>

<style>
.page-form-select {
  height: 100%;
  width: 100%;
}
</style>

