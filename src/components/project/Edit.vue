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
            <FormItem label="工程状态" prop>
              <Radio-group v-model="formItem.status">
                <Radio :label="1">进行中</Radio>
                <Radio :label="2">结项</Radio>
              </Radio-group>
            </FormItem>
            <FormItem label="委托单位" prop="customerCode">
              <Input
                v-model="formItem.customerName"
                placeholder
                class="width-1"
                readonly="readonly"
                icon="search"
                @on-click="selCustomer"
              />
            </FormItem>
            <FormItem label="客户信用等级">
              <Input v-model="formItem.customerBank" readonly="readonly"/>
            </FormItem>
            <FormItem label="联系人">
              <Input v-model="formItem.linkMan"/>
            </FormItem>
            <FormItem label="职称(职务)">
              <Input v-model="formItem.position" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="联系电话">
              <Input v-model="formItem.linkPhone" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="formItem.email" placeholder="不超过64个字符"/>
            </FormItem>
            <FormItem label="项目来源">
              <Radio-group v-model="formItem.source">
                <Radio label="委托">委托</Radio>
                <Radio label="投标">投标</Radio>
              </Radio-group>
            </FormItem>
            <FormItem label="投资额">
              <InputNumber
                style="width:100%;"
                :max="9999999999"              
                :min="0"               
                v-model="formItem.investment"
              ></InputNumber>
            </FormItem>
            <FormItem label="投资性质">
              <Select v-model="formItem.investmentType">
                <Option v-for="item in investmentType" :value="item.code" :key="item.code">{{ item.text }}</Option>
              </Select>
            </FormItem>
            <FormItem label="工程总规模" prop>
              <Input v-model="formItem.totalSize"/>
            </FormItem>
            <FormItem label="计量单位" prop>
              <Select v-model="formItem.unit" style="width:150px" placeholder="单位">
                <Option v-for="item in unit" :value="item.code" :key="item.code">{{ item.text }}</Option>
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
      <SelectCustomer ref="selCustomer" :transfer="false"></SelectCustomer>
    </div>
    <div slot="footer"></div>
  </Modal>
</template>
<script>
import Loading from '@/components/loading';
import SelArea from '@/components/selarea';
import SelectCustomer from '@/components/customer/SelectCustomer';
import page from '@/assets/js/page';
export default {
  components: {
    Loading, SelArea, SelectCustomer
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
        name: '',// 工程名称
        customerCode: '',// 委托单位
        customerName: '',// 委托单位
        customerBank: '',// 客户信用等级
        linkMan: '',// 联系人
        linkPhone: '',// 电话
        position: '',// 职务
        email: '',// 邮箱
        source: '委托',//RCHAR 项目来源: 委托、投标
        department: '',// 部门
        status: 1,// 工程状态:1.进行中, 2.结项
        investment: 0,// 投资额
        investmentType: '',// 投资性质
        totalSize: '',// 工程总规模
        unit: '',// 计量单位 
      },
      investmentType:[
        {code:'国有投资',text:'国有投资'},
        {code:'集体投资',text:'集体投资'},
        {code:'社会投资',text:'社会投资'},
        {code:'政府投资',text:'政府投资'},
        {code:'其他',text:'其他'},
      ],
      unit:[
        {code:'立方米',text:'立方米'},
        {code:'平方米',text:'平方米'},
        {code:'米',text:'米'},
        {code:'千米',text:'千米'},
        {code:'座',text:'座'},
        {code:'项',text:'项'},
        {code:'吨',text:'吨'},
        {code:'其他',text:'其他'},
      ],
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
    selCustomer() {
      var sel = this.$refs.selCustomer;
      sel.show({
        ok: (data) => {
          if (data) {
            console.log(data)
            this.formItem.customerCode = data.customerCode;
            this.formItem.customerName = data.customerName;
            this.formItem.customerBank = data.bank;
            this.formItem.linkMan = data.linkMan;
          }
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
      if (id) {
        this.isEdit = 1;
        this.formItem.id = id;
        this.get(id);
      } else {
        this.loading = 0;
        this.isEdit = 0;
        for (var x in this.formItem) {
          this.formItem[x] = ''
        }
        this.formItem.status = 1;// 工程状态:1.进行中, 2.结项
        this.formItem.source = "委托";
        this.formItem.investment = 0;// 投资额
        this.formItem.totalSize = '';// 工程总规模
      }
    },
    get(id) {
      this.loading = 1;
      this.$http.post('/api/engine/project/get?id=' + id, {}).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          Object.assign(this.formItem, res.data.data);
          console.log(res.data.data)
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
