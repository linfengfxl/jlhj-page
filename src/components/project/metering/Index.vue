<template>
  <ListPage
    ref="page"
    api="/api/engine/project/metering/summary"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      工程计量汇总表
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
         <td>
            <Input v-model="queryForm.projectName"  placeholder="工程名称" @on-enter="query"/>
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
    <ListPageDetail
      ref="detail"
      slot="page-datatable-detail"
      api=""
      listBind=""
      :columns="columns1"
    ></ListPageDetail>
  </ListPage>
</template>
<script>
import ListPage from '@/components/page/ListPage'; 
import ListPageDetail from '@/components/page/ListPageDetail';
import DataRowOperate from '@/components/commons/DataRowOperate';
import UploadBox from '@/components/upload/Index';
import SelectProject from '@/components/page/form/SelectProject';

import page from '@/assets/js/page';

export default {
  components: {
    ListPage, 
    DataRowOperate,
    ListPageDetail,
    UploadBox,
    SelectProject
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
          title: '工程编号',
          key: 'projectCode',
          align: 'left',
          width: 150,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          minWidth: 150,
        },
        {
          title: '拨付合计',
          key: 'total',
          align: 'left',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            return h('span',row.total>0?row.total:'');
          }
        }
      ],
      columns1: [ 
        {
          title: '拨付次数',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('span','第'+(params.index+1)+'次拨付');
          }
        },
        {
          title: '拨付金额',
          key: 'receiptAmount',           
          align: 'left',
          minWidth: 150,
        },
        page.table.initDateColumn({
          title: "拨付日期",
          key: "receiptDate",
        }),
      ],
      queryForm: { 
        projectName:'',
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
    reset() {
      Object.assign(this.queryForm, {
        projectName:'',
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.billId;
        this.$refs.detail.list=row.detailList;
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
