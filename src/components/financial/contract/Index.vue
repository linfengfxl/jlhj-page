<template>
  <ListPage ref="page" title="合同登记" api="/api/engine/financial/contract/list" 
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
            <Input v-model="queryForm.keyword"  placeholder="合同编号、名称" @on-enter="query"/>
          </td> 
          <td>
            <Input v-model="queryForm.customerName"  placeholder="客户名称" @on-enter="query"/>
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
    <contractEdit ref="edit" @on-save="query"></contractEdit>
    <contractView ref="view" @on-save="query"></contractView>
  </ListPage> 
</template>
<script>    
  import contractEdit from './contractEdit';
  import contractView from './contractView';
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import page from '@/assets/js/page';

  export default {
    components: {
      contractEdit,
      ListPage,
      DataRowOperate,
      contractView
    },
    data() {
      let that = this;
      return {
        tabName:'1',
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
            title: '合同编号',
            key: 'contractId',
            width:100,
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
            },row.contractId);
          }
          }, 
          {
            title: '合同名称',
            key: 'contractName',
            width:150,
          }, 
          {
            title: '客户名称',
            key: 'customerName',
            align: 'left',
            minWidth:150
          },
          page.table.initDateColumn({
            title: '签订日期',
            key: 'signDate',
          }),
          page.table.initDateColumn({
            title: '合同生效日期',
            key: 'validStartDate',
          }),
          page.table.initDateColumn({
            title: '合同终止日期',
            key: 'validEndDate',
          }),
          {
            title: '合同金额',
            key: 'amount',
            align: 'left',
            width:120
          },
          {
            title: '合同类型',
            key: 'contractType',
            align: 'left',
            width:120
          },
          {
            title: '付款方',
            key: 'paySubject',
            align: 'left',
            width:120
          },
          page.table.initMapColumn({
            title: '合同情况',
            key: 'status',
            data: {
              '1': '已做未签',
              '2': '未做',
              '3': '已签',
            }
          }),
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
          keyword: '',
          customerName:'',
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
        this.queryForm.keyword = '';
        this.queryForm.customerName = '';
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
              this.$http.post('/api/engine/financial/contract/delete', params.row).then((res) => {
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
      exportDown(){
        this.$refs.page.exportDown();
      },
      goBack: function () {
        this.$router.go(-1);
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
