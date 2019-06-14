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
