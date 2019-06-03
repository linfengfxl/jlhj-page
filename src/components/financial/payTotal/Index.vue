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
              <Radio :label="1">应付款</Radio>
              <Radio :label="2">全部</Radio>
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
          
        },
        {
          title: '发生额',
          key: 'amount',
          align: 'left',
          width: 120,
        },
        {
          title: '累计已付款额',
          key: 'payed',
          align: 'left',
          width: 150,
        },
        {
          title: '应付帐款金额',
          key: 'payNeed',
          align: 'left',
          width: 150,
        },
      ],
      queryForm: { 
        providerCode:'',
        status: 2, 
        createTime: null,
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
      var queryParam = this.$refs.page.queryParam;
      queryParam.createTimeStart = '';
      queryParam.createTimeEnd = '';
      delete queryParam.createTime;
      if (this.queryForm.createTime.length > 0) {
        queryParam.createTimeStart = page.formatDate(this.queryForm.createTime[0]);
      }
      if (this.queryForm.createTime.length > 1) {
        queryParam.createTimeEnd = page.formatDate(this.queryForm.createTime[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        providerCode:'',
        createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())],
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
