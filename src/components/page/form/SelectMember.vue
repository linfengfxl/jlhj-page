<template>
<!-- 选择收料员 -->
  <div class="page-form-select">
    <Input v-model="text" readonly="readonly" :placeholder="placeholder" icon="search" @on-click="selMember"></Input>
    <selMember ref="selMember"></selMember>
  </div>
</template>

<script>  
import selMember from '@/components/contacts/SelectMember'

export default { 
  components: { 
    selMember
  },
  props:{
    value:{
      type:String,
      default:''
    },
    model:{
      type:Object,
      default:null
    },
    text:{
      type:String,
      default:''
    },
    // 控件显示文本对应 model 属性
    textProp:{
      type:String,
      default:"operatorName"
    },
    placeholder:{
      type:String,
      default:""
    },
    readonly:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      id:'',
      trueName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.id = val;      
    },
    text(val,old){
      this.trueName = val;
    },
    model(val,old){

    }
  },
  methods:{ 
    selMember(row) {
      var sel = this.$refs.selMember;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input',data.id);
            if(this.model){ 
              this.model[this.textProp] = data.trueName;
            }
          }
        }
      });
    },
  }
}
</script>

<style>
  .page-form-select{
    height: 100%;
    width: 100%;
  }
</style>

