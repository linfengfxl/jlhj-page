<template>
   <div class="page">
    <div class="page-title">系统配置</div>
      <Card class="tysysinfo-card">
        <Loading :loading="loading">
          <div class="page-form">
            <Form
              :model="formItem"
              ref="form"
              :label-width="100"
              :rules="ruleValidate"
              class="form-item"
            >
              <table cellspacing="0" cellpadding="0">
                <colgroup>
                </colgroup>        
                <tr>
                  <td style="width:70%;">
                    <FormItem label="系统配置路径" prop="value">
                      <Input v-model="formItem.value" placeholder />
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormItem>
                      <Button type="primary" icon="checkmark" @click="save">保存</Button>
                      <Button type="ghost" @click="reset" style="margin-left: 8px">重置</Button>
                    </FormItem>
                  </td>
                </tr>
              </table>
            </Form>
          </div>
        </Loading>
      </Card>
      <Card class="tysysinfo-card">
        <Loading :loading="loading">
          <div class="page-form">
            <Form
              :model="formItem"
              ref="form"
              :label-width="110"
              :rules="ruleValidate"
              class="form-item"
            >
              <table cellspacing="0" cellpadding="0">
                <colgroup>
                </colgroup>        
                <tr>
                  <td >
                    <FormItem label="临时文件数量/个" >
                      <Input v-model="formItem.fileCount"/>
                    </FormItem>
                  </td>
                  <td>
                    <FormItem>
                    </FormItem>
                  </td>
                  <td >
                    <FormItem label="临时文件大小/KB" >
                      <Input v-model="formItem.fileSize"/>
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormItem>
                      <Button type="primary" icon="checkmark" @click="clearFile">清除</Button>
                      <Button type="ghost" @click="resetFile" style="margin-left: 8px">刷新</Button>
                    </FormItem>
                  </td>
                </tr>
              </table>
            </Form>
          </div>
        </Loading>
      </Card>
    </div>
</template>
<script>
import Loading from '@/components/loading';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading:0,
      formItem:{
        name:'',
        value:'',
        fileCount:0,
        fileSize:0
      },
      oriItem:{},
      ruleValidate: {
         value: [
          {
            required: true,
            whitespace: true,
            message: "系统配置路径不能为空",
            trigger: "change"
          }
        ],
      }
    }
  },
  mounted:function(){
    this.load();
    this.getFiles();
  },
  computed:{

  },
  methods:{
    load() {
      this.loading = 1;
      this.$http.post('/api/engine/setting/get', {}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.ormItem=res.data.data;
          this.formItem.name=this.ormItem.name;
          this.formItem.value=this.ormItem.value;
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      });
    },
    getFiles() {
      this.loading = 1;
      this.$http.post('/api/engine/setting/temp/info', {}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.formItem.fileCount=res.data.data.fileCount;
          this.formItem.fileSize=Math.round(res.data.data.fileSize/1024);
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      });
    },
    clearFile(){
      this.$Modal.confirm({
          title: "清除确认",
          content: "<p>清除后不能恢复，确定清除所有临时文件吗？</p>",
          onOk: () => {
            this.loading = 1;
            this.$http.post('/api/engine/setting/temp/clear', {}).then((res) => {
              if (res.data.code === 0) {
                this.loading = 0;
                this.$Message.success("清除成功");
                this.getFiles();
              } else {
                this.loading = 0;
                this.$Message.error(res.data.message);
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString());
            });
          }
        });
      
    },
    resetFile(){
      this.getFiles();
      this.$Message.success("操作成功");
    },
    reset(){
      this.formItem.value=this.ormItem.value;
    },
    save(){
      var pass = true;
      this.$refs.form.validate((valid) => {
        pass = valid;
      })
      if (!pass) {
        this.$Message.error('验证未通过！');
        return;
      }
      this.$http.post('/api/engine/setting/update', this.formItem).then((res) => {
        if (res.data.code === 0) {
            this.loading = 0;
            this.$Message.success("保存成功");
            this.ormItem.value=this.formItem.value;
          } else {
            this.loading = 0;
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
      });
    }
  }
}

</script>

<style type="text/css">
  .tysysinfo{

  }
  .tysysinfo-card{
    margin-top: 15px;
  }
  .tysysinfo-table{

  }
  .tysysinfo-table td{
    padding: 4px;
  }
  .tysysinfo-table-title{

  }
</style>
