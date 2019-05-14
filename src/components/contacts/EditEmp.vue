<template>
  <Modal v-model="show" :title="title" :closable="false" class="edit-user">
    <div class="page">
        <Loading :loading="loading"> 
        <div class="page-form">
        <Form :model="formItem" ref="form" :label-width="80" :rules="ruleValidate" class="form-item">
          <FormItem label="用户名" prop="loginName">
            <Input v-model="formItem.loginName" placeholder="用户名唯一"  :disabled="isEdit==1"/>
          </FormItem>
          <FormItem label="密码"  prop="password" v-if="isEdit==0">
            <Input v-model="formItem.password"  type="password"></Input>
          </FormItem>
          <FormItem label="姓名" prop="trueName">
            <Input v-model="formItem.trueName"/>
          </FormItem>
          <FormItem label="手机号码" prop="mobile">
            <Input v-model="formItem.mobile"/>
          </FormItem>
          <FormItem label="电子邮箱">
            <Input v-model="formItem.email"/>
          </FormItem> 
          <FormItem label="部门" prop="deptName"> 
            <i-input v-model="formItem.deptName" placeholder="请选择部门" readonly> 
              <Button slot="append" @click="selectDept" icon="more"></Button>
            </i-input>            
          </FormItem> 

          <FormItem label="岗位">
            <CheckboxGroup  v-model="formItem.roleIds">
              <div class="roles">
                <Checkbox :label="item.roleId" v-for="item in roles"> 
                  <span>&nbsp;{{item.roleName}}</span>
                </Checkbox>
              </div>              
            </CheckboxGroup >
          </FormItem> 

          <FormItem label="状态">
            <Radio-group v-model="formItem.status">
              <Radio :label="1">正常</Radio>
              <Radio :label="2">禁用</Radio>
            </Radio-group>
          </FormItem> 
          <FormItem>
            <div class="">
              <Button  icon="checkmark"  type="primary" @click="save" v-if="this.isEdit!=2">保存</Button>               
              <Button  @click="close" style="margin-left: 8px">取消</Button>
            </div>
          </FormItem>
        </Form>
        </div>
        </Loading>
      </div>
      <div slot="footer"></div>
      <SelectDept ref="dept" :type="2" @on-ok="updateDept" @on-close="closeDept"></SelectDept>
  </Modal>
</template>
<script>
import SelectDept from '@/components/commons/SelectDept';
import Loading from '@/components/loading';
import dateFormat from '@/assets/js/dateFormat';
import page from '@/assets/js/page';

export default {
  components: {
    SelectDept,
    Loading,
    page
  },
  data() {
    return {
      installed:1,
      loading:0,       
      show:false,
      //是否编辑 0 添加 1 编辑 2 查看
      isEdit:0,
      roles:[],
      //表单对象
      formItem: this.initItem(),
      ruleValidate: {
        trueName: [
          {required:true,whitespace: true,message: '姓名不能为空', trigger: 'blur'},
          {type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        loginName: [
          {required:true,whitespace: true,type: 'string', message: '用户名不能为空', trigger: 'blur'}
        ],
        password: [
          {required:true,whitespace: true,type: 'string', message: '密码不能为空', trigger: 'blur'}
        ],
        mobile: [           
          {pattern: /^1[0-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    title(){
      if(this.isEdit===0){
        return "添加用户";
      }else{
        return "修改用户";
      }
    } 
  },
  methods:{
    initItem(){
      return {
        id:0,
        loginName: '',
        password:'',

        trueName: '',                 
        mobile: '',
        email:'',
        weixin: '',

        deptName: '',
        deptNames:[],
        deptIds:[], 

        roleName: '',
        roleNames:[],
        roleIds:[],    

        status:1,    
      }
    },
    save(){
      this.$refs['form'].validate((valid) => {
        if (valid) {            
          this.saveEmp();
        }
      });
    },     
    saveEmp(){
      let url = '';
      let msg = '';
      if(this.isEdit == 0){
         url='/api/engine/user/edit';
         msg = '添加成功';
      }else{
         url = '/api/engine/user/edit';
         msg = '修改成功';
      }
      this.loading = 1; 
      this.$http.post(url, this.formItem).then((res) => {
        this.loading = 0; 
        if (res.data.code === 0) {
          this.$Message.success(msg);
          this.close();
          this.$emit("on-save");
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {          
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    //添加或编辑弹窗
    open(item) {
      this.$refs['form'].resetFields();
      this.formItem = Object.assign(this.initItem(),item);
      this.show = true;
      if(this.formItem.id > 0){
        this.isEdit = 1; 
      }else{
        this.isEdit = 0; 
      }
      this.loadRoles();
    },
    closeDept(){
      this.show = true;
    },
    close(){
      this.show = false;
    },
    selectDept(){
      this.show = false;
      this.$refs.dept.selectIds = this.formItem.deptIds;
      this.$refs.dept.open();
    },
    updateDept(depts){
      this.show = true;
      this.formItem.deptIds = [];      
      this.formItem.deptNames = [];
      depts.map(item=>{
        this.formItem.deptIds.push(item.deptId);
        this.formItem.deptNames.push(item.deptName);        
      })

      this.formItem.deptName = this.formItem.deptNames.join('，');
       
      this.$refs.dept.close();
    },
    loadRoles(){
      if(this.roles.length == 0){
        this.$http.post('api/engine/role/all', this.formItem).then((res) => {
          this.loading = 0; 
          if (res.data.code === 0) {
            this.roles = res.data.data;
          } 
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      }
    }
  }
}

</script>

<style type="text/css">
  .edit-user .roles{
    height: 280px;
    overflow-y: auto;
    border:1px solid #eee;
    border-radius: 3px;
  }

  .edit-user .roles .ivu-checkbox-group-item{
    display: block;    
    margin-top: 4px;
    padding: 0 10px;
  }
  .edit-user .roles .ivu-checkbox-group-item:hover{
    background-color: #e8f8fd
  }
</style>
