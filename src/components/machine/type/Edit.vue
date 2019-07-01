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
            <FormItem label="型号编码" prop="machineModel">
              <Input v-model="formItem.machineModel" :disabled="isEdit == 1" class="width-1"/>
            </FormItem>
            <FormItem label="型号名称" prop="materName">
              <Input v-model="formItem.materName" />
            </FormItem>
            <FormItem label="规格" prop>
              <Input v-model="formItem.spec"/>
            </FormItem>
            <FormItem label="单位" prop="unit">
              <Select v-model="formItem.unit" style="width:150px">
                <Option
                  v-for="item in $args.getArgGroup('unit')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否有效">
              <i-switch v-model="formItem.status" :true-value="1" :false-value="2"></i-switch>
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
import page from '@/assets/js/page';
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
        id:'',
        machineModel: '',//型号编码
        materName: '',//型号名称
        spec: '',//规格 
        unit: '',//单位
        status: 1,//是否有效
      },
      //验证
      ruleValidate: {
        machineModel: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        materName: [
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
        url = '/api/engine/machine/type/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/machine/type/update';
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
        this.formItem.id = code;
        this.get(code);
      } else {
        this.loading = 0;
        this.isEdit = 0;
        for (var x in this.formItem) {
          this.formItem[x] = ''
        }
        this.formItem.status=1;
      }
    },
 
    get(code) {
      this.$http.post('/api/engine/machine/type/get?id=' + code, {id:code}).then((res) => {
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
