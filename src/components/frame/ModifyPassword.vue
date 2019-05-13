<template>
  <Modal
    v-model="show"
    :title="title"
    :mask-closable="false"
    :closable="false">
    <div class="page">
      <Loading :loading="loading">
      <div class="page-form">
         <Form ref="form" :model="item" :rules="ruleValidate" :label-width="80">
            <FormItem label="旧密码" prop="oldPassword">
                <Input  v-model="item.oldPassword" type="password" placeholder="输入旧密码"></Input>
            </FormItem>
            <FormItem label="新密码" prop="password">
                <Input  v-model="item.password" type="password" placeholder="输入新密码"></Input>
            </FormItem>
            <FormItem label="确认新密码" prop="finalPassword">
                <Input  v-model="item.finalPassword" type="password" placeholder="输入确认密码"></Input>
            </FormItem>
            <FormItem>
                <Button  type="primary" icon="checkmark" @click="save()">确定</Button>
                <Button  type="default" @click="cancel()" style="margin-left: 20px">取消</Button>
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
    var that = this;
    return {
      loading:1,
      show:false,
      title:"修改密码",
      item:{ 
        oldPassword:'',
        finalPassword:'',
        password:''
      },
      ruleValidate: {
          oldPassword: [
              { required: true, message: '旧密码不能为空', trigger: 'blur' },               
          ],
          password: [
              { required: true, message: '密码不能为空', trigger: 'blur' },
              {type: 'string', min:6,max: 16, message: '6~16个字符，区分大小写', trigger: 'blur' }
          ],
          finalPassword: [
              { required: true, message: '确认密码不能为空', trigger: 'blur' },
              {type: 'string', min:6, max: 16, message: '6~16个字符，区分大小写', trigger: 'blur' }
          ]
      }
    }
  },
  mounted:function(){

  },
  methods:{
     open: function() {
      this.loading = 0;
      this.$refs['form'].resetFields();
      this.show = true; 
    },
    save:function(){
      this.$refs['form'].validate((valid) => {
          if (valid) { 
            this.loading = 1;
            if(this.item.password != this.item.finalPassword){
                this.$Message.info("密码不一致，重新输入");                 
                this.loading = 0;
                return;
            }
            this.modifyPwd(this.item);
          } else {
            return ;
          }
      });
    },
    modifyPwd(item){
      this.$http.post('/api/engine/login/chgpwd', {
        oldPassword:item.oldPassword,
        password:item.finalPassword,
      }).then((res) => {
        if (res.data.code === 0) {
              this.show = false;
              this.loading =0;
              this.$Message.success("修改密码成功");
              this.$emit("on-submit-modifyPassword");
        } else {
              this.loading = 0;
              this.show = true;
              this.$Message.error(res.data.message);
        }
      }).catch((error) => {
          this.$Message.error(error.toString())
      });
    },
    reset:function(){
      this.$refs['form'].resetFields();
    },
    cancel:function(){
      this.show = false;
      this.$emit('on-cancel');
    }
  }
}

</script>

<style type="text/css">

</style>
