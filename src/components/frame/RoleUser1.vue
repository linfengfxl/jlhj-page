<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false" width="680">
    <div class="page">
      <Loading :loading="loading">
      <div class="page-form">
        <Transfer :data="data2" :target-keys="targetKeys2" filterable @on-change="onchange"
          :list-style="listStyle" :operations="['取消','授权']" :titles="['未授权','已授权']"></Transfer>
        <br>
        <Button type="primary" icon="checkmark" @click="save">保存</Button>
        <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
      </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
  import Loading from '@/components/loading';

  export default {
    components: {
      Loading,
    },
    data() {
      return {
        loading: 1,
        show: false,
        //是否编辑 0 添加 1 编辑
        isEdit: 0,
        //表单对象
        formItem: {
          roleId: 0,
          roleName: '',
          remark: '',
          powerIds:'',
        },
        data2:[],
        targetKeys2: [],
        listStyle: {
          width: '250px',
          height: '400px'
        }
      }
    },
    computed: {
      title() {
        return "角色 - " + this.formItem.roleName;
      },
    },
    mounted(){
      this.loadUsers();
    },
    methods: { 
      loadUsers () {
        let mockData = [];
        this.$http.post('/api/admin/list', {page:1,pageSize:1000}).then((res) => {
           
          if (res.data.code === 0) {
            var rows = res.data.data.rows;
            var data = [];
            rows.map((admin)=>{
              admin.key = admin.userId;
              admin.label = admin.nickName + ' - ' +admin.loginName;
              data.push(admin);
            })

            this.data2 = data; 
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
            this.$Message.error(error.toString());
        }); 
      },  
      onchange(ids){
        this.targetKeys2 = ids;
      },
      save() {
        this.loading = 1;
        this.$http.post("/api/admin/addUserRole", {
          userId:this.targetKeys2,
          roleId:this.formItem.roleId,
        }).then((res) => {
          this.close();
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      saveRole() {
        let url = '';
        let msg = '';
        if (this.isEdit === 0) {
          url = '/api/role/add';
          msg = '添加成功';
        } else {
          url = '/api/role/edit';
          msg = '修改成功';
        }

        var ids = [];
        this.$refs.powerCheckTree.checked.map((p)=>{
          if(p != ''){
            ids.push(p);
          }
        });
        this.formItem.powerIds = ids.join(',');

        this.loading = 1;
        this.$http.post(url, this.formItem).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) {
            this.$Message.success(msg);
            this.close();
            this.$emit("on-save");
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      open(roleId,roleName) {
        this.formItem.roleName = roleName;
        this.formItem.roleId = roleId;
        this.show = true;
        this.loading = 0;
        this.getRole(roleId);
        return;
      },
      getRole(roleId) {
        this.loading = 1;
        this.$http.post('/api/role/getUserIds?roleId=' + roleId, {}).then((res) => {
          if (res.data.code === 0) {
            this.loading = 0; 
            this.targetKeys2 = res.data.data;
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
      },
      close() {
        this.show = false;
      } 
    }
  }

</script>

<style type="text/css">
  .form-sub-title {
    font-size: 14px;
    margin: 0 0 12px 18px;
    color: #2b85e4;
  }
</style>
