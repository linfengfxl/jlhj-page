<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="130"
            :rules="ruleValidate"
            class="form-item"
          >
            <!--<FormItem label="上级编码" prop="code">
              <Select v-model="formItem.unit" style="width:150px" placeholder="单位">
                <Option
                  v-for="item in $args.getArgGroup('unit')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>-->
            <FormItem label="层级编码" prop="levelCode">
              <Input v-model="formItem.levelCode" :disabled="isEdit == 1" class="width-1"/>
            </FormItem>
            <FormItem label="分部分项工程名称" prop="subProjectName">
              <Input v-model="formItem.subProjectName" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="设计工作量" prop="designWorkload">
              <InputNumber
                style="width:100%;"
                :max="9999999999"              
                :min="0"               
                v-model="formItem.designWorkload"
              ></InputNumber>
            </FormItem>
             <FormItem label="复核工作量" prop="reviewWorkload">
              <InputNumber
                style="width:100%;"
                :max="9999999999"              
                :min="0"               
                v-model="formItem.reviewWorkload"
              ></InputNumber>
            </FormItem>
            <FormItem label="单位" prop>
              <Select v-model="formItem.unit" style="width:150px" placeholder="单位">
                <Option
                  v-for="item in $args.getArgGroup('unit')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
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
        projectCode: '',// 工程编号
        levelCode: '',
        subProjectName: '',
        designWorkload: 0,
        reviewWorkload: 0,
        unit: '',
      },
      //验证
      ruleValidate: {
        levelCode: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        subProjectName: [
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
        url = '/api/engine/project/workload/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/project/workload/update';
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
     reset() {
      Object.assign(this.formItem, {
        projectCode: this.formItem.projectCode,// 工程编号
        levelCode: '',
        subProjectName: '',
        designWorkload: 0,
        reviewWorkload: 0,
        unit: '',
      });
      if(this.isEdit == 1){
        this.get(this.formItem.id);
      }
    },
    openEdit(id) {
      this.show = true;
      this.$refs['form'].resetFields();
      if (id) {
        this.isEdit = 1;
        this.formItem.id = id;
        this.get(id);
      } else {
        this.$Message.error("请选择工程量")
      }
    },
    openAdd(projectCode) {
      this.show = true;
      this.$refs['form'].resetFields();
      this.loading = 0;
      this.isEdit = 0;
      this.formItem.projectCode=projectCode;
      this.reset();    
    },
    get(id) {
      this.loading = 1;
      this.$http.post('/api/engine/project/workload/get', {workloadId:id}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
        } else {
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
  }
}

</script>

<style type="text/css">
.customeredit .width-1 {
  width: 160px;
}
</style>
