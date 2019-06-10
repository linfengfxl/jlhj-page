<template>
  <ListPage
    ref="page"
    api="/api/engine/financial/expense/list"
    :model="this"
    @onCurrentRowChange="curRowChg"
    :beforeLoad="beforeLoad"
  >
    <div class="page-title" slot="page-title">
      报销单
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="2">通过</Radio>
              <Radio :label="1">审批中</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td class="page-tools">
            <Button @click="add" v-power icon="plus">报销单</Button>&nbsp;
          </td>
          <td class="page-tools" v-if="queryForm.status==0"></td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <Input v-model="queryForm.billId" placeholder="报销单号" @keyup.enter.native="query"></Input>
          </td>
          <td>
            <Select v-model="queryForm.catalog" style="width:100px;" placeholder="报销分类">
              <Option v-for="item in catalog" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td>
          <td>
            <SelectProject v-model="queryForm.projectId" :model="queryForm" :text="queryForm.projectName" textProp="projectName" />
          </td>
          <td><Input v-model="queryForm.operatorName" placeholder="经办人"/></td>
          <td>
            <Select v-model="queryForm.legal" style="width:100px;" placeholder="法律主体">
              <Option v-for="item in $args.getArgGroup('legal')" :value="item.argCode" :key="item.argCode">{{ item.argCode }}</Option>
            </Select>
          </td>
          <td>报销日期</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.billDate"
              split-panels
              placeholder="报销日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
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
      api="/api/engine/financial/expense/getDetailList?billId="
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
          width: 80,
          align: 'center',
          fixed: 'left', 
          render: (h, params) => {
            var row = params.row;             
            return h(DataRowOperate, {
              props: {
                btns: [{
                  key: 'edit',                   
                  disabled: row.status != 3
                }]
              },
              on: {
                click: (key) => {
                  if (key == "edit") {
                    this.edit(row);
                  }
                  if (key == "delete") {
                    this.del(row);
                  }
                }
              }
            });
          }
        },
        {
          title: '报销单号',
          key: 'billId',
          width: 140,
          align: 'center',
          fixed: 'left',
          render:(h,params)=>{
            var row = params.row;
            var text = row.billId;
            text = text;
            return h('a',{
              props:{

              },
              on:{
                click:()=>{
                  this.$router.push({path:'/financial/expense/view?forward&inst='+row.instId});
                }
              }
            },text);
          }
        },
        page.table.initDateColumn({
          title: '报销日期',
          key: 'billDate',
          align: 'center', 
        }),
        {
          title: '分类',
          key: 'catalog',
          align: 'center',
          width: 100,
        },
        {
          title: '工程名称',
          key: 'projectName',
          align: 'left',
          width: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 100,
        },
        {
          title: '银行户名',
          key: 'bankAccName',
          align: 'left',
          width: 150,
        },
        {
          title: '开户银行',
          key: 'bankOpen',
          align: 'left',
          width: 150,
        },
        {
          title: '开户账号',
          key: 'bankAccount',
          align: 'left',
          width: 150,
        },
        {
          title: '经办人',
          key: 'operatorName',
          align: 'center',
          width: 100,
        },
        {
          title: '部门',
          key: 'deptName',
          align: 'center',
          width: 100,
        },
        {
          title: '支付方式',
          key: 'payWay',
          align: 'center',
          width: 100,
        },
        {
          title: '法律主体',
          key: 'legal',
          align: 'center',
          width: 100,
        },
        {
          title: '附件',
          key: 'files',
          align: 'center',
          width: 200,
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
          title: '描述',
          key: 'describe',
          align: 'left',
          width: 100,
        },

        page.table.initMapColumn({
          title: '状态',
          key: 'status',
          data: {
            '0': '待提交',
            '1': '审核中',
            '2': '通过',
            '3': '驳回',
          }
        }),
        {
          title: '创建人',
          key: 'creatorName',
          align: 'center',
          width: 100,
        },
        page.table.initDateColumn({
          title: '创建日期',
          key: 'createTime',
        }),
      ],
      columns1: [ 
        {
          title: '费用科目',
          key: 'feeTypeName',           
          align: 'left',
          width: 150,
        },
        {
          title: '金额',
          key: 'amount',
          align: 'center',
          width: 100,
        },
        {
          title: '描述',
          key: 'describe',
          align: 'left',
        },
      ],
      queryForm: { 
        billId:'',
        projectId:'',
        projectName:'',
        catalog:'',
        status: 2,  
        billDate: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      },
      catalog:[
        {code:'生产类',text:'生产类'},
        {code:'行政类',text:'行政类'},
        {code:'财务类',text:'财务类'},
        {code:'伙食类',text:'伙食类'},
        {code:'业务招待费',text:'业务招待费'},
        {code:'其他类',text:'其他类'}
      ],
      loading: 0
    }
  },
  mounted: function () {
    this.reset();
  },
  methods: {
    query() {
      //   if (!this.queryForm.storageId) {
      //     this.$Message.error('请选择仓库');
      //     return;
      //   }
      this.$refs.page.query();
    },
    beforeLoad() {
      var queryParam = this.$refs.page.queryParam;
      queryParam.billDateStart = '';
      queryParam.billDateEnd = '';
      delete queryParam.billDate;
      if (this.queryForm.billDate.length > 0) {
        queryParam.billDateStart = page.formatDate(this.queryForm.billDate[0]);
      }
      if (this.queryForm.billDate.length > 1) {
        queryParam.billDateEnd = page.formatDate(this.queryForm.billDate[1]);
      }
    },
    reset() {
      Object.assign(this.queryForm, {
        billId:'',
        projectId:'',
        projectName:'',
        catalog:'',
        status: 2,  
        billDate: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
      });
      this.query();
    },
    curRowChg(row) {
      if(row != null) {
        this.curRow = row;
        this.curRowId = row.billId;
        this.$refs.detail.load(this.curRowId);
      } else {
        this.curRow = null;
        this.curRowId = null;
        this.$refs.detail.clear();
      }
    },
    add() {
      this.$router.push({ path: '/financial/expense/start?forward'})
    },
    edit(row) {
      this.$router.push({
        path: '/financial/expense/start?forward&id=' + row.billId
      })
    },
    exportDown(){
      this.$refs.page.exportDown();
    },
    sendAudit() {
      var selection = this.$refs.page.getSelection();
      if (selection.length == 0) {
        this.$Message.error('请选择要操作的数据行');
        return;
      }
      var start = 0;
      var handle = () => {
        if (start >= selection.length) {
          return;
        }
        var item = selection[start];
        this.$http.post('/api/stock/bill/submit?stockBillId=' + item.stockBillId, {}).then((res) => {
          if (res.data.code === 0) {
            this.$Message.info("第 " + (start + 1) + " 条操作成功");
            start++;
            if (start < selection.length) {
              handle();
            } else {
              this.$refs.page.load();
            }
          } else {
            this.$Message.error(res.data.message)
            this.$refs.page.load();
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error(error.toString())
        });
      }
      handle();
    },
    del(row) {
      this.$Modal.confirm({
        title: '删除确认',
        content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
        onOk: () => {
          if (row) {
            this.loading = 1;
            this.$http.post('/api/engine/storage/instock/delete', {
              stockBillId: row.stockBillId,
            }).then((res) => {
              this.loading = 0;
              if (res.data.code === 0) {
                this.$Message.success("删除成功");
                this.$refs.page.query();
              } else {
                this.$Message.error(res.data.message)
              }
            }).catch((error) => {
              this.loading = 0;
              this.$Message.error(error.toString())
            });
          }
        }
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
