<template>
  <Modal v-model="show" :title="title" :closable="false" :mask-closable="false">
    <div class="page customerview">
      <Loading :loading="loading">
        <div class="page-form">
          <Form ref="form" :label-width="100">
            <FormItem label="编号">{{formItem.customerCode}}</FormItem>
            <FormItem label="名称">{{formItem.customerName}}</FormItem>
            <FormItem label="组织机构代码">{{formItem.orgCode}}</FormItem>
            <FormItem label="单位性质">{{$args.getArgText('customer_org_type', formItem.orgType)}}</FormItem>
            <FormItem label="客户行业">{{$args.getArgText('customer_industry', formItem.industry)}}</FormItem>
            <FormItem label="客户类型">{{$args.getArgText('customer_type', formItem.type)}}</FormItem>
            <FormItem label="客户信用">{{$args.getArgText('customer_bank', formItem.bank)}}</FormItem>
            <FormItem label="所在区域">{{formItem.area}}</FormItem>
            <FormItem label="邮政编码">{{formItem.postcode}}</FormItem>
            <FormItem label="联系人">{{formItem.linkMan}}</FormItem>
            <FormItem label="联系电话">{{formItem.linkPhone}}</FormItem>
            <FormItem label="联系地址">{{formItem.address}}</FormItem>
            <FormItem>
              <Button type="primary" icon="checkmark" @click="close">确定</Button>
              <Button type="ghost" @click="edit" style="margin-left: 8px">编辑</Button>
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
import areajs from '@/assets/js/area'

export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: 1,
      show: false,
      //表单对象
      formItem: {
        customerId: '',
        customerName: '',
        bank: '',
        bankCardNo: '',
        taxNo: '',
        legalPerson: '',
        linkMan: '',
        linkPhone: '',
        faxNo: '',
        postcode: '',
        industry: '',
        industryName: '',
        area: '',
        address: '',
        invoiceAddress: '',
      },
      clickEdit: () => { }
    }
  },
  computed: {
    title() {
      if (this.isEdit) {
        return "编辑客户信息";
      } else {
        return "客户信息";
      }
    },
  },
  mounted() {

  },
  methods: {
    open(item) {
      this.show = true;
      Object.assign(this.formItem, item);
      this.loading = 0;
    },
    close() {
      this.show = false;
    },
    edit() {
      this.show = false;
      this.clickEdit();
    }
  }
}

</script>

<style type="text/css">
.ivu-form-item-content {
  word-break: break-all;
}
</style>
