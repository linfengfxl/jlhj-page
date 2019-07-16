<template>
  <!-- 选择收料员 -->
  <div class="page-form-select">
    <!-- <Input v-model="text"   :placeholder="placeholder" icon="search" @on-click="selMember"></Input> -->

    <AutoComplete
      @input="onInput"
      :readonly="readonly"
      :placeholder="placeholder"
      :textProp="textProp"
      :text="text"
      @on-click="selMember"
      @on-remote-search="onRemoteSearch"
      :model="model"
    ></AutoComplete>
    <selMember ref="selMember"></selMember>
  </div>
</template>

<script>  
import selMember from '@/components/contacts/SelectMember'
import AutoComplete from './AutoComplete'

export default {
  components: {
    selMember,
    AutoComplete
  },
  props: {
    value: {
      type: [String, Number],
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
      default: "operatorName"
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
      id: '',
      trueName: ''
    };
  },
  mounted() {

  },
  computed: {

  },
  watch: {
    value(val, old) {
      this.id = val;
    },
    text(val, old) {
      this.trueName = val;
    },
    model(val, old) {

    }
  },
  methods: {
    selMember(row) {
      var sel = this.$refs.selMember;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input', data.id);
            if (this.model) {
              this.model[this.textProp] = data.trueName;
            }
          }
        }
      });
    },
    onInput(e) {
      this.$emit('input', e);
    },
    onRemoteSearch(sender) {
      sender.loading = true;
      sender.$http.post("/api/engine/user/list", { keyword: sender.innerText }).then((res) => {
        sender.loading = false; 
        if (res.data.code === 0) {
          var list = res.data.data.rows;
          sender.items = list.map((item) => { return { label: item.trueName, value: item.trueName } });
        } else {

        }
      }).catch((error) => {
        sender.loading = false;
      });
    }
  }
}
</script>

<style>
.page-form-select {
  height: 100%;
  width: 100%;
}
</style>

