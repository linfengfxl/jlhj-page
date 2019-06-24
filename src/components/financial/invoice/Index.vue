<template>
  <ListPage ref="page" title="发票收票登记" api="/api/engine/financial/invoice/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
            <td>
              <Button  @click="add" icon="plus">添加</Button>
            </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            <Input v-model="queryForm.projectName"  placeholder="工程名称" @on-enter="query"/>
          </td> 
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
          <td>&nbsp;</td>
          <td><Button @click="exportDown" type="info" icon="ios-download-outline">导出</Button></td>
        </tr>
      </table>
    </div>
    <invoiceEdit ref="edit" @on-save="query"></invoiceEdit>
    <invoiceView ref="view" @on-save="query"></invoiceView>
  </ListPage> 
</template>
<script>    
  import invoiceEdit from './invoiceEdit';
  import invoiceView from './invoiceView';
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import page from '@/assets/js/page';
  import UploadBox from '@/components/upload/Index';

  export default {
    components: {
      invoiceEdit,
      ListPage,
      DataRowOperate,
      invoiceView,
      UploadBox
    },
    data() {
      let that = this;
      return {
        columns: [
          {
            title:'操作',
            width: 120,
            align: 'center',
            fixed:'left',
            render:(h,params)=>{
              var row = params.row;
              return h(DataRowOperate,{
                props:{
                  btns:[{
                    key:'edit',
                    
                  },
                  {
                    key:'delete',
                  }]
                },
                on:{
                  click:(key)=>{
                    if(key=="edit"){
                      this.rowCommand("编辑",params);
                    }
                    if(key=="delete"){
                      this.rowCommand("删除",params);
                    }
                  }
                }
              });
            }
          },  
          {
            title: '单据编号',
            key: 'invoiceReceiptCode',
            width:150,
            fixed:'left',
            render:(h,params)=>{
              var row = params.row;
              return h('a',{
                props:{

                },
                on:{
                  click:()=>{
                    this.$refs.view.open(row);
                    this.$refs.view.clickEdit = () => {
                      this.update(row);
                    }
                  }
                }
              },row.invoiceReceiptCode);
            }
          }, 
          {
            title: '工程名称',
            key: 'projectName',
            align: 'left',
            minWidth:200
          },
          page.table.initDateColumn({
            title: '发票日期',
            key: 'invoiceDate',
          }),
          {
            title: '发票类型',
            key: 'invoiceType',
            width:150,
          }, 
          {
            title: '发票号码',
            key: 'invoiceNo',
            width:120,
          }, 
          {
            title: '组织机构代码证',
            key: 'orgCode',
            width:120,
          }, 
          {
            title: '发票金额',
            key: 'amount',
            align: 'center',
            width:70
          },
          {
            title: '金额大写',
            key: 'amountCapital',
            align: 'left',
            minWidth:150
          },
          {
            title: '纳税人识别号',
            key: 'taxpayerNo',
            align: 'center',
            width:120
          },
          {
            title: '开户银行',
            key: 'bank',
            align: 'left',
            minWidth:100
          },
          {
            title: '开户账号',
            key: 'bankCardNo',
            align: 'center',
            width:70
          },
          {
            title: '付款单位',
            key: 'payOrg',
            align: 'center',
            width:70
          },
          {
            title: '收款单位',
            key: 'providerName',
            align: 'left',
            minWidth:200
          },
          {
            title: '开票类型',
            key: 'billingType',
            align: 'center',
            width:120
          },
          {
            title: '备注',
            key: 'remark',
            align: 'left',
            width:120
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
            title: '创建人',
            key: 'creatorName',
            align: 'center',
            width: 100,
          }, 
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            width: 160,
          },
        ],
        queryParam: {},
        queryForm: {
          projectName:'',
        },
        loading: 0
      }
    },
    mounted: function () {
      this.query();
    },
    computed: {},
    methods: {
      beforeLoad(){

      },
      query() { 
        this.$refs.page.query();
      },
      reset: function () {
        // 清空条件
        this.queryForm.projectName = '';
        this.query();
      },
      rowCommand: function (name, params) {
        if (name === '编辑') {
          this.update(params.row);
          return;
        }
        if (name === '删除') {
          this.$Modal.confirm({
            title: '删除确认',
            content: '<p>删除后不能恢复，确定删除已选择的记录吗？</p>',
            onOk: () => {               
              this.$http.post('/api/engine/financial/invoice/delete', params.row).then((res) => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  this.$refs.page.load();
                } else {
                  this.$Message.error(res.data.message)
                }
              }).catch((error) => {
                this.$Message.error(error.toString())
              });
            }
          });
        }
      },
      goBack: function () {
        this.$router.go(-1);
      },
      exportDown(){
        this.$refs.page.exportDown();
      },
      add: function () {
        this.$refs.edit.open(0);
      },
      update: function (invoice) {
        this.$refs.edit.open(invoice);
      },
    }
  }

</script>

<style type="text/css">

</style>
