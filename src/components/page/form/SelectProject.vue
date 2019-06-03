<template>
<!-- 选择工程 -->
  <div class="page-form-select">
    <Input v-model="text" readonly="readonly" :placeholder="placeholder" icon="search" @on-click="selProject"></Input>
    <SelProject ref="selProject"></SelProject>
  </div>
</template>

<script>  
import SelProject from '@/components/project/SelectProject'

export default { 
  components: { 
    SelProject
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
      default:"projectName"
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
      projectId:'',
      projectName:''
    };
  },
  mounted(){
     
  },
  computed:{

  },
  watch:{
    value(val,old){
      this.projectId = val;      
    },
    text(val,old){
      this.projectName = val;
    },
    model(val,old){

    }
  },
  methods:{ 
    selProject(row) {
      var sel = this.$refs.selProject;//引用该控件，赋值给变量对象
      sel.show({
        ok: (data) => {
          if (data) {
            this.$emit('input',data.projectCode);
            if(this.model){ 
              this.model[this.textProp] = data.name;
            }
            this.$emit('on-select',data);
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

