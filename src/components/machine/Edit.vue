<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="80"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="编码" prop="machineCode">
              <Input v-model="formItem.machineCode" :disabled="isEdit == 1" class="width-1"/>
            </FormItem>
            <FormItem label="名称" prop="machineName">
              <Input v-model="formItem.machineName" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="机械型号" prop> 
                <Input v-model="formItem.machineModel" placeholder="不超过64个字符"/>
            </FormItem>

            <FormItem label="供应商名称" prop>
              <Input v-model="formItem.provider" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="供应商联系人" prop>
              <Input v-model="formItem.provider" placeholder="不超过12个字符"/>
            </FormItem>
            <FormItem label="租赁类型" prop>
              <Select v-model="formItem.leaseType" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in $args.getArgGroup('lease_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="备注" prop>
              <Input v-model="formItem.remark" placeholder="不超过256个字符"/>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="checkmark" @click="save">保存</Button>
              <Button type="ghost" @click="reset" style="margin-left: 8px" v-if="this.isEdit==1">重置</Button>
              <Button type="ghost" @click="close" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
import SelArea from '@/components/selarea';
import SelContacts from '@/components/selcontacts';
import page from '@/assets/js/page';
export default {
  components: {
    Loading, SelArea, SelContacts
  },
  data() {
    return {
      loading: 1,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      //表单对象
      formItem: {
        machineCode: '',//机械代码
        machineName: '',//机械名称
        machineModel: '',//机械型号
        provider: '',//供应商编码
        leaseType: '',//租赁类型
        remark:'',//备注
      },
      //验证
      ruleValidate: {
        machineCode: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        machineName: [
          { required: true, whitespace: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit === 0) {
        return "添加";
      } else {
        return "编辑";
      }
    },
  },
  methods: {
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveItem();
        } else {
          return;
        }
      });
    },
    saveItem() {
      let url = '';
      let msg = '';
      if (this.isEdit === 0) {
        url = '/api/engine/machine/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/machine/update';
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
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    open(id) {
      this.show = true;
      this.$refs['form'].resetFields();
      this.checked = [];
      if (id > 0) {
        this.isEdit = 1;
        this.formItem.id = id;
        this.get(id);
      } else {
        this.loading = 0;
        this.isEdit = 0;
        for (var x in this.formItem) {
          this.formItem[x] = ''
        }
      }
    },
    get(id) {
      this.$http.post('/api/engine/machine/get?id=' + id, {}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.formItem = res.data.data;
          var strIds = this.formItem.powerIds;
          //加载功能点 
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
    },
    reset() {
      this.checked = [];
      this.$refs['form'].resetFields();
      this.get(this.formItem.id);
    }
  }
}

</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}
</style>
