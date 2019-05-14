<template>
  <Modal v-model="show" :title="title" :closable="false" class="edit-user">
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
            <FormItem label="编码" prop="materCode">
              <Input v-model="formItem.materCode" placeholder="用户名唯一" :disabled="isEdit==1"/>
            </FormItem>
            <FormItem label="名称" prop="materName">
              <Input v-model="formItem.materName"/>
            </FormItem>
            <FormItem label="规格型号" prop>
              <Input v-model="formItem.spec"/>
            </FormItem>
            <FormItem label="计量单位" prop>
              <Select v-model="formItem.unit" style="width:150px" placeholder="计量单位">
                <Option
                  v-for="item in $args.getArgGroup('unit')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <div class>
                <Button icon="checkmark" type="primary" @click="save" v-if="this.isEdit!=2">保存</Button>
                <Button @click="close" style="margin-left: 8px">取消</Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </Loading>
    </div>
    <div slot="footer"></div>
    <SelectDept ref="dept" @on-check="updateDept" @on-close="closeDept"></SelectDept>
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
      installed: 1,
      loading: 0,
      show: false,
      //是否编辑 0 添加 1 编辑 2 查看
      isEdit: 0,
      //表单对象
      formItem: this.initItem(),
      ruleValidate: {
        materCode: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 30, message: '不能超过30个字', trigger: 'blur' }
        ],
        materName: [
          { required: true, whitespace: true, type: 'string', message: '名称不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit === 0) {
        return "添加";
      } else {
        return "修改";
      }
    }
  },
  methods: {
    initItem() {
      return {
        id: 0,
        materCode: '',
        type: 1,
        materName: '',
        spec: '',
        unit: '',
        resourceType: ''
      }
    },
    save() {
      if (!this.formItem.resourceType) {
        this.$Message.error("请选择资源类别")
        return;
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.save();
        }
      });
    },
    save() {
      let url = '';
      let msg = '';
      if (this.isEdit == 0) {
        url = '/api/engine/material/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/material/update';
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
      this.formItem = Object.assign(this.initItem(), item);
      this.show = true;
      if (this.formItem.id > 0) {
        this.isEdit = 1;
      } else {
        this.isEdit = 0;
      }
    },
    closeDept() {
      this.show = true;
    },
    close() {
      this.show = false;
    },
    selectDept() {
      if (this.isEdit != 2) {
        this.show = false;
        this.$refs.dept.selectIds = this.formItem.deptIds;
        this.$refs.dept.open();
      }
    },
    updateDept(depts) {
      this.show = true;
      this.formItem.deptIds = [];
      this.formItem.deptNames = [];
      depts.map(item => {
        this.formItem.deptIds.push(item.deptId);
        this.formItem.deptNames.push(item.deptName);
      })

      this.formItem.deptName = this.formItem.deptNames.join(',');

      this.$refs.dept.close();
    },
  }
} 
</script> 
