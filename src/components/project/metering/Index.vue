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
          title: '操作',
          width: 120,
          align: 'center',
          fixed:'left',
          render: (h, params) => {
            var row = params.row;
            var loginName=this.$user.trueName;
            var createName='';
            if(row.createMetering == 1&&row.detailList!=null){
              createName=row.detailList[0].creatorName;
            }
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',
                  disabled: row.createMetering == 0||loginName!=createName//只有创建人才可编辑
                },
                {
                  key: 'add',
                  text:'添加计量表',
                  disabled: row.createMetering == 1
                },]
              },
              on: {
                click: (key) => {
                  if (key == "add") {
                    this.add(row);
                  }
                  if (key == "edit") {
                    this.edit(row);
                  }
                }
              }
            });
          }
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
          title: '计量金额合计',
          key: 'totalmeteringamount',
          align: 'left',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            return h('span',row.totalmeteringamount>0?row.totalmeteringamount:'');
          }
        },
        {
          title: '批复金额合计',
          key: 'totalreplyamount',
          align: 'left',
          width: 150,
          render: (h, params) => {
            var row = params.row;
            return h('span',row.totalreplyamount>0?row.totalreplyamount:'');
          }
        }
      ],
      columns1: [ 
        {
          title: '序号',
          type: 'index',           
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: "日期",
          key: "meteringDate",
        }),
        {
          title: '计量金额',
          key: 'meteringAmount',           
          align: 'left',
          width: 150,
        },
        {
          title: '批复金额',
          key: 'replyAmount',           
          align: 'left',
          minWidth: 150,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 350,
          render:(h,params)=>{
            var row = params.row;
            return h(UploadBox,{
              props:{
                value:row.files,
                readonly:true
              }
            });
          }
        },
        {
          title: '创建人',
          key: 'creatorName',           
          align: 'center',
          width: 150,
        },
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
    add: function (row) {
      this.$router.push({
        path: "/project/metering/edit?forward&projectCode="+row.projectCode+"&projectName="+row.projectName+"&click=add"
      });
    },
    edit: function (row) {
      this.$router.push({
        path: "/project/metering/edit?forward&projectCode="+row.projectCode+"&projectName="+row.projectName+"&click=edit"
      });
    },
    goPage(page) {
      this.$router.push({ path: page });
    }
  }
}

</script>

<style type="text/css">
</style>
