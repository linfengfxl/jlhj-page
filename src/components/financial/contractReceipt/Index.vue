<template>
  <ListPage ref="page" title="合同收款登记" api="/api/engine/financial/contractReceipt/list" 
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
            <Input v-model="queryForm.receiptAccount"  placeholder="收款户名" @on-enter="query"/>
          </td> 
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
    <contractReceiptEdit ref="edit" @on-save="query"></contractReceiptEdit>
    <contractReceiptView ref="view" @on-save="query"></contractReceiptView>
  </ListPage> 
</template>
<script>    
  import contractReceiptEdit from './contractReceiptEdit';
  import contractReceiptView from './contractReceiptView';
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import page from '@/assets/js/page';
  import UploadBox from '@/components/upload/Index';

  export default {
    components: {
      contractReceiptEdit,
      ListPage,
      DataRowOperate,
      contractReceiptView,
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
            key: 'contractReceiptCode',
            width:150,
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
            },row.contractReceiptCode);
          }
          }, 
          {
            title: '收款户名',
            key: 'receiptAccount',
            width:120,
          }, 
          page.table.initDateColumn({
            title: '收款日期',
            key: 'receiptDate',
          }),
          {
            title: '收款类型',
            key: 'receiptType',
            align: 'center',
            width:120
          },
          {
            title: '工程名称',
            key: 'projectName',
            align: 'left',
            minWidth:200
          },
          {
            title: '合同甲方',
            key: 'customerName',
            align: 'left',
            minWidth:100
          },
          {
            title: '罚款',
            key: 'penalty',
            align: 'center',
            width:70
          },
          {
            title: '扣款',
            key: 'deduction',
            align: 'center',
            width:70
          },
           {
            title: '收款金额',
            key: 'receiptAmount',
            align: 'center',
            width:70
          },
           {
            title: '经手人',
            key: 'payee',
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
          receiptAccount: '',
          projectName:'',
        },
        selection: [],
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
        this.queryForm.receiptAccount = '';
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
              this.$http.post('/api/engine/financial/contractReceipt/delete', params.row).then((res) => {
                if (res.data.code === 0) {
                  this.$Message.success("删除成功");
                  this.$refs.page.query();
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
      update: function (contract) {
        this.$refs.edit.open(contract);
      },
    }
  }

</script>

<style type="text/css">

</style>
