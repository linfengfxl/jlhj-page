<template> 
  <div class="page formItem"> 
    <div class="page-bar">
      <Icon type="document"></Icon> 我的账号
    </div>
    <div>
      <Loading :loading="loading" :mask="mask">
      <Form :label-width="80" ref="form" :model="formItem" class="formItem-from" :rules="ruleValidate" >
          <FormItem label="登录名" prop="loginName">            
            {{formItem.loginName}}
          </FormItem>

          <FormItem label="密码">            
            <Button  @click="chgpwd">修改密码</Button>
          </FormItem>

          <FormItem label="姓名" prop="trueName">
            <Input v-model="formItem.trueName"/>
          </FormItem>

          <FormItem label="手机号码" prop="mobile">
            <Input v-model="formItem.mobile"/>
          </FormItem>

          <FormItem label="邮箱" prop="email">
            <Input v-model="formItem.email"/>
          </FormItem>

          <FormItem label="微信" prop="weixin">
            <Input v-model="formItem.weixin"/>
          </FormItem> 

          <FormItem label=""> 
            <Button class="btn-save" type="primary" @click="save">保存</Button>   
          </FormItem>

      </Form>
      </Loading>
    </div>
    <div>
      <Loading v-if="loading"></Loading> 
    </div>
    <ModifyPassword ref="chgpwd"></ModifyPassword>
  </div>
</template>
<script>
import Loading from '@/components/loading';
import ModifyPassword from '@/components/frame/ModifyPassword';

export default {
  components: {
    Loading,
    ModifyPassword
  },
  data() {  
    return { 
      loading:0,
      mask:1,
      formItem:{
        loginName:'1',
        trueName:'',
        mobile:'',
        emial:'',
        weixin:''
      },
      ruleValidate: {
        trueName: [
          {required:true,whitespace: true,message: '姓名不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],                  
        mobile: [           
          {pattern: /^1[0-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ]
      }
    }
  },
  mounted:function(){ 
    this.load();
  },
  computed:{

  },
  methods:{
    load: function() {
      this.loading = 1;
      this.mask = 2;  
      this.$http.post("/api/engine/login/getinfo").then((res) => {
        this.loading = 0;
        if (res.data.code === 0) { 
          var data = res.data.data;
          Object.assign(this.formItem,data);
        }else{
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
          this.loading = 0;
          this.$Message.error("获取信息出错，请刷新页面")
      });
    },
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.doSave();
        }
      });
    },
    doSave(){
      this.loading = 1; 
      this.$http.post('/api/engine/login/chginfo', this.formItem).then((res) => {
        this.loading = 0; 
        if (res.data.code === 0) {
          this.$Message.success("保存成功");
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {          
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    chgpwd(){
      this.$refs.chgpwd.open();
    }
  }
}

</script>

<style type="text/css">
  
  .formItem-from{
    width: 340px;
    margin: auto;
    margin-top: 40px;
  }

  .formItem .btn-save{
    width: 100px;
  }

</style>
