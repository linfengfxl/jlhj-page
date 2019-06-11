<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/paytotal/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      应付账款汇总表
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="0">应付款</Radio>
              <Radio :label="1">全部</Radio>
            </RadioGroup>
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <SelectProvider
              v-model="queryForm.providerCode"
              :model="queryForm"
              :text="queryForm.providerName"
              placeholder="供应商名称"
              style="width:240px"
            />
          </td>
          <td>供应商类别</td>
          <td>
            <Select v-model="queryForm.providerType" style="width:240px" placeholder="类型">
              <Option
                v-for="item in $args.getArgGroup('provider_type')"
                :value="item.argCode"
                :key="item.argCode"
              >{{ item.argText }}</Option>
            </Select>
          </td>
          <td>
            <Button @click="query" type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset">重置</Button>
          </td>
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div> 
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage'; 
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';
import SelectProvider from "@/components/page/form/SelectProvider"; //供应商
import page from '@/assets/js/page';

export default {
  components: {
    ListPage, 
    DataRowOperate,
    ListPageDetail,
    UploadBox,
    SelectProvider
  },
  data() {
    let that = this;
    return {
      curRow: null,
      columns: [ 
        {
          title: '序号',
          width: 100,
          type:'index',
          align: 'center',
        },
        {
          title: '供应商名称',
          key: 'providerName',
          align: 'left',
          width: 200,
        }, 
        {
          title: '供应商联系人',
          key: 'linkMan',
          align: 'left',
          width: 120,
        },
        {
          title: '供应商类别',
          key: 'providerType',
          align: 'left',
          minWidth: 150,
          render: (h, params) => {
            var row = params.row;
            return h('label', this.$args.getArgText('provider_type', row.providerType));
          }
        },
        {
          title: '发生额',
          key: 'amount',
          align: 'left',
          width: 120,
          render: (h, params) => {
            var row = params.row;
            return h('span', row.amount==0?"":row.amount);
          }
        },
        {
          title: '累计已付款额',
          key: 'payed',
          align: 'left',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            return h('span', row.payed==0?"":row.payed);
          }
        },
        {
          title: '应付帐款金额',
          key: 'payneed',
          align: 'left',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            var payneed =row.payneed;
            return h('span', payneed>0?payneed:"");
          }
        },
      ],
      queryForm: { 
        providerCode:'',
        providerName:'',
        providerType:'',
        status: 0, 
      },
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      this.$refs.page.query();
    },
    beforeLoad() {
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    reset() {
      Object.assign(this.queryForm, {
        providerCode:'',
        providerName:'',
        providerType:'',
        status: this.queryForm.status, 
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
      } else {
        this.curRow = null;
        this.curRowId = null;
      }
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
