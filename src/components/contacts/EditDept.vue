<template>
   <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div lass="page">
        <Loading :loading="loading">
        <div class="page-form">
          <Form ref="form" :model="formItem" :rules="ruleValidate" :label-width="80">
                <FormItem label="部门编码" prop="deptId">
                    <Input size="small" v-model="formItem.deptId"></Input>
                </FormItem>
                <FormItem label="部门名称" prop="deptName">
                    <Input size="small" v-model="formItem.deptName"></Input>
                </FormItem>
                <FormItem label="上级部门" prop="parentId">
                    <Input size="small" v-model="formItem.parentId"></Input>
                </FormItem>
                <FormItem label="排序" prop="seq">
                    <Input size="small" v-model="formItem.seq"></Input>
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
      formItem:{
        deptId:'',
        deptName:'',
        parentId:'',
        seq:0,
      },
      title:'新建部门',
      isEdit:0,
      ruleValidate: {
        deptId: [
          {required:true,whitespace: true,message: '编码不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        deptName: [
          {required:true,whitespace: true,message: '名称不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    openEdit(init){
      this.title = "修改部门"

      this.formItem = Object.assign({
        deptId:'',
        deptName:'',
        parentId:'',
        seq:0, 
      },init);

      this.loading = 0;
      this.isEdit = 1;
      this.show = true;
    },
    openAdd(init){ 
      this.title = "新建部门"

      this.formItem = Object.assign({
        deptId:'',
        deptName:'',
        parentId:'' ,
        seq:0 
      },init);

      this.loading = 0;
      this.isEdit = 0;
      this.show = true;
    }, 
    cancel(){
      this.show = false;
    },
    close(){
      this.show = false;
    },
    save(){
       this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = 1;          
          var url = '/api/engine/dept/add';
          var msg = '添加成功';
          if(this.isEdit){
            url = '/api/engine/dept/update'
            msg = '修改成功';
          } 
          this.loading = 1;
          this.$http.post(url, this.formItem).then((res) => {
            this.loading = 0; 
            if (res.data.code === 0) {
              this.$Message.success(msg);
              this.close();
              this.$emit("on-save",this.formItem);
            } else {
              this.$Message.error(res.data.message)
            }
          }).catch((error) => {
            this.loading = 0;
            this.$Message.error(error.message)
          });
       }
    });
  }
}
}

</script>

<style type="text/css">

</style>
