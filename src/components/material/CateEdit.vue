<template>
   <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div lass="page">
        <Loading :loading="loading">
        <div class="page-form">
          <Form ref="form" :model="item" :rules="ruleValidate" :label-width="80">
                <FormItem label="上级编码"> 
                    {{item.parentCode}}<span v-if="item.parentCode">.</span>
                </FormItem>
                <FormItem label="编码" prop="code1">
                    <Input size="small" v-model="item.code1" placeholder="请输入编码名称" :disabled="isEdit==1"></Input>
                </FormItem>
                <FormItem label="名称" prop="title">
                    <Input size="small" v-model="item.title" placeholder="请输入名称"></Input>
                </FormItem>
                <FormItem>
                     <Button  type="primary" @click="save">保存</Button>
                     <Button  type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
                </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer">
    </div>
   </Modal>
</template>
<script>
import Loading from '@/components/loading';

export default {
  components: {
     Loading
  },
  data() {
    return {
      loading:0,
      show:false,
      item:{
        title:'',
        code:'',
        code1:'',
        parentCode:'', 
      },
      title:'新建',
      isEdit:0,
      ruleValidate: {
        title: [
          {required:true,whitespace: true,message: '名称不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        code1: [
          {required:true,whitespace: true,message: '编码名称不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    open(isEdit,title,code,parentCode) { 
      this.$refs['form'].resetFields();
      this.show = true;
      this.isEdit = isEdit; 
      this.item.title = title; 
      this.item.parentCode = parentCode; 
      this.item.code = code;
      this.item.code1 = code;
      this.loading = 0;
      if(isEdit == 1){
        this.title = '编辑';
        if(parentCode != null && parentCode != ''){ 
          if(code.indexOf(parentCode + '.')==0){
            this.item.code1 = code.substring(parentCode.length + 1);
          }
        }
      }else{
        this.title = '新建';
      }
    },
    cancel(){
      this.show = false;
    },
    save(){
       this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = 1;
          this.show = false;
          if(this.isEdit){
            this.$emit('on-submit-edit',this.item);
          }else{ 
            if(this.item.parentCode && this.item.parentCode.length>0){
              this.item.code = this.item.parentCode + '.' +this.item.code1;
            }else{
              this.item.code = this.item.code1;
            }
            this.$emit('on-submit',this.item);
          }
       }else{
          return;
       }
    });
  }
}
}

</script>

<style type="text/css">

</style>
