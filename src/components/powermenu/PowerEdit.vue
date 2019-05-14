<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="100"
            :rules="ruleValidate"
            class="form-item"
          >
            <div class="form-sub-title">
              <Icon type="compose"></Icon>
              {{title}}
            </div>
            <FormItem label="功能点ID" prop="powerId">
              <InputNumber
                :max="999999"
                :min="0"
                v-model="formItem.powerId"
                :disabled="this.isEdit"
              ></InputNumber>
            </FormItem>
            <FormItem label="功能点key" prop="powerKey">
              <Input v-model="formItem.powerKey" placeholder="功能点key"/>
            </FormItem>
            <FormItem label="类型" prop="powerType">
              <Select v-model="formItem.powerType" style="width:150px" placeholder="类型">
                <Option
                  v-for="item in types"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="图标" prop="powerIcon">
              <Input v-model="formItem.powerIcon" placeholder="图标"/>
            </FormItem>
            <FormItem label="标题" prop="powerCaption">
              <Input v-model="formItem.powerCaption" placeholder="标题"/>
            </FormItem>

            <FormItem label="功能点url" prop="powerUrl">
              <Input v-model="formItem.powerUrl" placeholder="功能点url"/>
            </FormItem>
            <FormItem label="是否显示">
              <i-switch v-model="formItem.isShow" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="父级ID" prop="parentId">
              <InputNumber :max="999999" :min="0" v-model="formItem.parentId"></InputNumber>
            </FormItem>
            <FormItem label="排序" prop="seq">
              <InputNumber :max="999999" :min="0" v-model="formItem.seq"></InputNumber>
            </FormItem>
            <FormItem>
              <Button type="primary" icon="checkmark" @click="save">保存</Button>
              <Button type="ghost" @click="reset" style="margin-left: 8px">重置</Button>
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

export default {
  components: {
    Loading,
  },
  data() {
    return {
      loading: 1,
      show: false,
      isEdit: true,
      unit: [],
      types: [
        { argCode: 1, argText: '模块' },
        { argCode: 2, argText: '页面' },
        { argCode: 3, argText: '功能点' }
      ],
      //表单对象
      formItem: {
        powerId: null,
        powerKey: '',
        powerType: '',
        powerIcon: '',
        powerCaption: '',
        powerUrl: '',
        isShow: 1,
        parentId: null,
        seq: null,
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        powerId: [
          { required: true, message: '功能点ID不能为空' },
        ],
        powerKey: [
          { required: true, message: '功能点key不能为空' },
        ],
        powerType: [
          { required: true, message: '类型不能为空' },
        ],
        powerCaption: [
          { required: true, message: '标题不能为空' },
        ],
        parentId: [
          { required: true, message: '父级ID不能为空' },
        ],
        seq: [
          { required: true, message: '排序不能为空' },
        ]
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        return "编辑功能点信息";
      } else {
        return "新建功能点信息";
      }
    },
  },
  mounted() {
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
      if (this.formItem.powerId == this.formItem.parentId) {
        this.$Message.error('功能点ID和父级ID不能相同!');
        return;
      }
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/power.update?';
        msg = '修改成功';
      } else {
        url = '/api/engine/power.add?';
        msg = '添加成功';
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
    open(power) {
      this.loading = 1;
      this.show = true;
      this.$refs['form'].resetFields();

      if (power.powerId != null && power.powerId != '') {
        this.$http.post('/api/engine/power.get?', power).then((res) => {
          this.loading = 0;
          if (res.data.code == 0 && res.data.data != null) {
            this.oriItem = res.data.data;
            $.extend(this.formItem, this.oriItem);
          } else {
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.message)
        });
        this.isEdit = true;
      } else {
        Object.assign(this.oriItem, {
          powerId: null,
          powerKey: '',
          powerType: '',
          powerIcon: '',
          powerCaption: '',
          powerUrl: '',
          isShow: 1,
          parentId: null,
          seq: null,
        });
        Object.assign(this.formItem, this.oriItem);
        this.loading = 0;
        if (power.parentId != null && power.parentId != '') {
          this.formItem.parentId = power.parentId;
          this.oriItem.parentId = power.parentId;
        } else {
          this.formItem.parentId = 0;
          this.oriItem.parentId = 0;
        }
        this.isEdit = false;
      }
    },
    close() {
      this.show = false;
    },
    reset() {
      $.extend(this.formItem, this.oriItem);
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
