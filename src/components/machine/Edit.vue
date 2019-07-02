<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="90"
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
              <Select v-model="formItem.machineModel" style="width:150px" >
                <Option
                  v-for="item in machineModels"
                  :value="item.machineModel"
                  :key="item.machineModel"
                >{{ item.machineModel }}</Option>
              </Select>
            </FormItem> 
            <FormItem label="供应商" prop="provider">
              <Input
                v-model="formItem.providerName"
                placeholder
                class="width-1"
                readonly="readonly"
                icon="search"
                @on-click="selProvider"
              />
            </FormItem>

            <FormItem label="供应商联系人" prop>
              <Input v-model="formItem.linkMan" readonly="readonly"/>
            </FormItem>
            <FormItem label="租赁类型" prop="leaseType">
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
      <SelProvider ref="selProvider" :transfer="false"></SelProvider>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
import SelArea from '@/components/selarea';
import SelProvider from '@/components/provider/SelectProvider';
import page from '@/assets/js/page';
export default {
  components: {
    Loading, SelArea, SelProvider
  },
  data() {
    return {
      loading: 1,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: 0,
      //表单对象
      formItem: {
        id:'',
        machineCode: '',//机械代码
        machineName: '',//机械名称
        machineModel: '',//机械型号 
        leaseType: '',//租赁类型
        remark: '',//备注

        provider: '',//供应商编码
        providerName: '',//供应商 
        linkMan: '',//供应商联系人
      },
      machineModels:[],//型号
      machineCode:'',
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
        leaseType: [
          { required: true, whitespace: true, message: '租赁类型不能为空', trigger: 'change' },
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
    open(code) {
      this.show = true;
      this.$refs['form'].resetFields();
      this.checked = [];
      if (code!='') {
        this.isEdit = 1;
        this.machineCode = code;
        this.get(code);
      } else {
        this.loading = 0;
        this.isEdit = 0;
        for (var x in this.formItem) {
          this.formItem[x] = ''
        }
      }
      this.getModel();
    },
    get(code) {
      this.$http.post('/api/engine/machine/get?machineCode=' + code, {}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          Object.assign(this.formItem, res.data.data);
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    getModel() {
      this.$http.post('/api/engine/machine/type/list', {status:1}).then((res) => {
        if (res.data.code === 0) {
          this.loading = 0;
          this.machineModels=res.data.data.rows;
        } else {
          this.loading = 0;
          this.$Message.error(res.data.message)
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.message)
      });
    },
    selProvider() {
      var sel = this.$refs.selProvider;
      sel.show({
        ok: (data) => {
          if (data) {
            this.formItem.provider = data.providerCode;
            this.formItem.providerName = data.providerName;
            this.formItem.linkMan = data.linkMan;
          }
        }
      });
    },
    close() {
      this.show = false;
    },
    reset() {
      this.checked = [];
      this.$refs['form'].resetFields();
      this.get(this.machineCode);
    }
  }
}

</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}
</style>
