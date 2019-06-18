<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page customeredit">
      <Loading :loading="loading">
        <div class="page-form">
          <Form
            :model="formItem"
            ref="form"
            :label-width="100"
            :rules="ruleValidate"
            class="form-item"
          >
            <FormItem label="编号" prop="customerCode">
              <Input
                v-model="formItem.customerCode"
                placeholder
                :disabled="isEdit"
                class="width-1"
                :maxlength="50"
              />
            </FormItem>
            <FormItem label="名称" prop="customerName">
              <Input v-model="formItem.customerName" placeholder :maxlength="100"/>
            </FormItem>
            <FormItem label="组织机构代码" prop>
              <Input v-model="formItem.orgCode" placeholder :maxlength="50"/>
            </FormItem>
            <FormItem label="单位性质" prop>
              <Select v-model="formItem.orgType" style="width:150px" placeholder="单位性质">
                <Option
                  v-for="item in $args.getArgGroup('customer_org_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="客户行业" prop>
              <Select v-model="formItem.industry" style="width:150px" placeholder="客户行业">
                <Option
                  v-for="item in $args.getArgGroup('customer_industry')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="客户类型">
              <Select v-model="formItem.type" style="width:150px" placeholder="客户类型">
                <Option
                  v-for="item in $args.getArgGroup('customer_type')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="客户信用" prop>
              <Select v-model="formItem.bank" style="width:150px" placeholder="客户信用">
                <Option
                  v-for="item in $args.getArgGroup('customer_bank')"
                  :value="item.argCode"
                  :key="item.argCode"
                >{{ item.argText }}</Option>
              </Select>
            </FormItem>
            <FormItem label="所在区域" prop>
              <Input v-model="formItem.area" placeholder class="width-1" :maxlength="50"/>
            </FormItem>
            <FormItem label="邮政编码" prop>
              <Input v-model="formItem.postcode" placeholder class="width-1" :maxlength="50"/>
            </FormItem>
            <FormItem label="联系人" prop>
              <Input v-model="formItem.linkMan" placeholder class="width-1" :maxlength="50"/>
            </FormItem>
            <FormItem label="联系电话" prop>
              <Input v-model="formItem.linkPhone" placeholder :maxlength="100"/>
            </FormItem>
            <FormItem label="详细地址" prop>
              <Input v-model="formItem.address" placeholder :maxlength="50"/>
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
import SelArea from '@/components/selarea';

export default {
  components: {
    Loading, SelArea
  },
  data() {
    return {
      loading: 1,
      show: false,
      //是否编辑 0 添加 1 编辑
      isEdit: false,
      //表单对象
      formItem: {
        id: 0,
        customerCode: '',//客户编号	 			 
        customerName: '',//名称	
        type: '',//类别 1.勘察、2.设计、3.施工、4.建设、5.监理		
        orgCode: '',//组织机构代码	
        orgType: '',//单位性质:1.政府部门 2.国企 3.民企 4.外资 5其他	
        industry: '',//行业	
        bank: '',//客户信用: A B C	
        linkPhone: '',//联系电话	
        linkMan: '',//	联系人	
        postcode: '',//邮政编码	
        area: '',//	所在区域	
        address: '',//详细地址	  
      },
      oriItem: {
      },
      //验证
      ruleValidate: {
        customerId: [
          { required: true, whitespace: true, message: '编码不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
        customerName: [
          { required: true, whitespace: true, message: '名称不能为空', trigger: 'blur' },
          { type: 'string', max: 50, message: '不能超过50个字', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        return "编辑客户信息";
      } else {
        return "添加客户信息";
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
      let url = '';
      let msg = '';
      if (this.isEdit) {
        url = '/api/engine/customer/update';
        msg = '修改成功';
      } else {
        url = '/api/engine/customer/add';
        msg = '添加成功';
      }

      this.loading = 1;
      this.formItem.status = 1;
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
    open(item) {
      this.show = true;
      this.$refs['form'].resetFields();

      if (item.id && item.id !== '') {
        this.isEdit = true;
        this.oriItem = item;
      } else {
        this.isEdit = false;
        this.oriItem = Object.assign({
          customerCode: '',//客户编号	
          type: '',//类别 1.勘察、2.设计、3.施工、4.建设、5.监理					 
          customerName: '',//名称	
          orgCode: '',//组织机构代码	
          orgType: '',//单位性质:1.政府部门 2.国企 3.民企 4.外资 5其他	
          industry: '',//行业	
          bank: '',//客户信用: A B C	
          linkPhone: '',//联系电话	
          linkMan: '',//	联系人	
          postcode: '',//邮政编码	
          area: '',//	所 在区域	
          address: '',//详细地址	
          status: '',//状态（1.正常 2.禁用）
        }, item);
      }
      Object.assign(this.formItem, this.oriItem);
      this.loading = 0;
    },
    close() {
      this.show = false;
    },
    reset() {
      $.extend(this.formItem, this.oriItem);
    },
  }
} 
</script>
  
