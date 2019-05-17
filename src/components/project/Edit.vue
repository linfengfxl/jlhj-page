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
            <FormItem label="编码" prop="projectCode">
              <Input v-model="formItem.projectCode" :disabled="isEdit == 1" class="width-1"/>
            </FormItem>
            <FormItem label="名称" prop="name">
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="名称" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="工程状态" prop>
               <Radio-group v-model="formItem.investmentType">
                <Radio :label="1">进行中</Radio>
                <Radio :label="2">结项</Radio>
              </Radio-group> 
            </FormItem>
            <FormItem label="委托单位" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="客户信用等级" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="联系人" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="职称(职务)" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="联系电话" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="邮箱" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="项目来源" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="投资额" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="投资性质" >
              <Input v-model="formItem.name" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="工程总规模" prop>
              <Input v-model="formItem.regisFunds"/>
            </FormItem>
            <FormItem label="计量单位" prop>
              <Select v-model="formItem.unit" style="width:150px" placeholder="类型">
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
        projectCode: '',//供应商编号
        name: '',//单位名称
        providerType: '',//供应商类别
        area: '',//所在地区
        address: '',//公司地址',
        legalPerson: '',//法人',
        regisFunds: '',//注册资金',
        linkMan: '',//联系人',
        linkPhone: '',//联系电话',
        taxNo: '',//税号',
        taxpayerType: '',//纳税人类型',
        taxRate: 0,//税率',
        taxRate1: 0,//税率',
        invoiceType: '',//发票类型',
        bank: '',//开户银行',
        bankAccount: '',//银行户名',
        bankCardNo: '',//开户账号',
        mainBusiness: '',//主营业务',
        developTime: '',//发展日期',
        disableTime: '',//停用日期',
        status: '',//状态（1 正常 2 禁用） 
      },
      //验证
      ruleValidate: {
        projectCode: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        name: [
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
        url = '/api/engine/project/add';
        msg = '添加成功';
      } else {
        url = '/api/engine/project/update';
        msg = '修改成功';
      }
      this.formItem.developTime = page.formatDate(this.formItem.developTime);//发展日期 
      if (!this.formItem.developTime) { this.formItem.developTime = null }
      this.formItem.disableTime = page.formatDate(this.formItem.disableTime);//停用日期   
      if (!this.formItem.disableTime) { this.formItem.disableTime = null }
      this.formItem.taxRate = this.formItem.taxRate1 * 0.01;//税率
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
        this.formItem['taxRate'] = 0;
        this.formItem['taxRate1'] = 0;
      }
    },
    get(id) {
      this.loading = 1;
      this.$http.post('/api/engine/project/get?id=' + id, {}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
          this.formItem.taxRate1 = this.formItem.taxRate * 100
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
