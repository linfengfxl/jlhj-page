<template>
  <ListPage ref="page" title="" api="/api/engine/workflow/mywork" 
  :model="this" :beforeLoad="beforeLoad">
    <Tabs :animated="false" v-model="name" @on-click="load">
      <TabPane label="待处理" name="handling" ></TabPane>
      <TabPane label="已处理" name="handled" ></TabPane>
      <TabPane label="已发送" name="sended" ></TabPane>
      <Button type="primary" @click="startPro" size="small" slot="extra" class="mywork-start-extra">发起流程</Button>
    </Tabs>
    <div class="page-searchbox" style="margin-top: 0px">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td v-if="queryForm.type>1">
            <RadioGroup v-model="queryForm.status" type="button" @on-change="query">
              <Radio :label="0">所有</Radio>              
              <Radio :label="1">审批中</Radio>
              <Radio :label="2">通过</Radio>
              <Radio :label="3">驳回</Radio>
              <Radio :label="4">作废</Radio>
            </RadioGroup>
          </td>
          <td>
            <Input v-model="queryForm.title" placeholder="请输入流程名称" style="width:150px" @keyup.enter.native="query"></Input>
          </td> 
          <td>
            <Button type="primary" icon="ios-search" @click="query">查询</Button>
          </td>
        </tr>
      </table>
    </div>
    <div>
      <ProcessLog ref="log"></ProcessLog>
    </div>
  </ListPage>
</template>
<script>
  import ListPage from '@/components/page/ListPage';
  import Loading from '@/components/loading';
  import ProcessLog from '@/components/workflow/mywork/ProcessLog';
  import DataRowOperateBar from '@/components/commons/DataRowOperateBar';

  export default {
    components: {
      ListPage,
      DataRowOperateBar,
      Loading,
      ProcessLog
    },
    data() {
      let that = this;
      return { 
        name:'handling', 
        columns:[], 
        columns1:[
          {
            title: '流程名称',
            key: 'title',
            minWidth:200,
            render: (h, params) => {
              var row = params.row;
              var text = row.title;
              return h('a',{
                props:{

                },
                style: {
                    marginRight: '5px'
                  },
                on:{
                  click:()=>{
                    this.handle(params.row);
                  }
                }
              },text);
            }
          },
          /*{
            title: '流程来源',
            key: 'source',
            width: 100
          },*/
           {
            title: '发起时间',
            key: 'startTime',
            align: 'center',
            width: 180
          },
          {
            title: '发起人',
            key: 'startUserName',
            width: 100,
            align: 'center'
          },
          {
            title: '接收时间',
            key: 'updateTime',
            align: 'center',
            width: 180
          },
          {
            title: '操作',
            width:100,
            align:'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.logs(params.row.id);
                    }
                  }
                }, '日志')
              ]);
            }
          }
        ],
        columns2:[ 
          {
            title: '流程名称',
            key: 'title',
            render: (h, params) => {
              var row = params.row;
              var text = row.title;
              return h('a',{
                props:{

                },
                style: {
                    marginRight: '5px'
                  },
                on:{
                  click:()=>{
                    this.view(params.row);
                  }
                }
              },text);
            }
          },
          /*{
            title: '流程来源',
            key: 'source',
            width: 100
          },*/
           {
            title: '发起时间',
            key: 'startTime',
            align: 'center',
            width: 180
          },
          {
            title: '发起人',
            key: 'startUserName',
            width: 100,
            align: 'center',
          },
          {
            title: '处理时间',
            key: 'operTime',
            align: 'center',
            width: 180
          },
          {
            title: '当前处理人',
            key: 'curUserName',
            align: 'left',
            width: 120,
            render:(h,params)=>{
              var row = params.row;
              if(row.curNodeName!=""){
                return h('span',null,[row.curUserName ,h('span',{style:'color:#999'},' ('+row.curNodeName+')')]);
              }
              return h('span',null,[row.curUserName ,h('span',{style:'color:#999'},"")]);
            }
          },
          {
            title: '流程状态',
            key: 'status',
            align: 'center',
            width: 120,
            render:(h,params)=>{
              var row = params.row;
              if(row.status == 1){
                return h('label',{
                },'审批中');
              }
              if(row.status == 2){
                return h('label',{
                },'完成');
              }
              if(row.status == 3){
                return h('label',{
                },'驳回');
              }
              if(row.status == 4){
                return h('label',{
                },'作废');
              }
            }
          },
          {
            title: '操作',
            width:100,
            align:'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.logs(params.row.id);
                    }
                  }
                }, '日志')
              ]);
            }
          }
        ], 
        columns3:[ 
          {
            title: '流程名称',
            key: 'title',
            render: (h, params) => {
              var row = params.row;
              var text = row.title;
              return h('a',{
                props:{

                },
                style: {
                    marginRight: '5px'
                  },
                on:{
                  click:()=>{
                    this.view(params.row);
                  }
                }
              },text);
            }
          },
          /*{
            title: '流程来源',
            key: 'source',
            width: 100
          },*/
           {
            title: '发起时间',
            key: 'startTime',
            align: 'center',
            width: 180
          },
          {
            title: '当前处理人',
            key: 'curUserName',
            align: 'left',
            width: 120,
            render:(h,params)=>{
              var row = params.row;
              if(row.curNodeName!=""){
                return h('span',null,[row.curUserName ,h('span',{style:'color:#999'},' ('+row.curNodeName+')')]);
              }
              return h('span',null,[row.curUserName ,h('span',{style:'color:#999'},"")]);
            }
          },
          {
            title: '流程状态',
            key: 'status',
            align: 'center',
            width: 120,
            render:(h,params)=>{
              var row = params.row;
              if(row.status == 1){
                return h('label',{
                },'审批中');
              }
              if(row.status == 2){
                return h('label',{
                },'完成');
              }
              if(row.status == 3){
                return h('label',{
                },'驳回');
              }
              if(row.status == 4){
                return h('label',{
                },'作废');
              }
            }
          },
          {
            title: '操作',
            width:120,
            align:'center',
            render: (h, params) => {
              var btn = 
              h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px',                    
                  },
                  on: {
                    click: () => {
                      this.edit(params.row);
                    }
                  }
                }, '编辑');

              return h('div', [
                params.row.status == 3?btn:null,
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.logs(params.row.id);
                    }
                  }
                }, '日志')
              ]);
            }
          }
        ],
        keyword:'',
        queryParam:{

        },
        queryForm:{
          title:'',
          page:'',
          pageSize:'',
          type:1, //1.待处理 2.已处理 3.已发送
          status:0, //1.审批中 2.通过 3.驳回 4.作废
        } 
      }
    },
    mounted () {
      this.load(this.name);
    },
    methods: {
      query() { 
        this.$refs.page.query();
      },
      beforeLoad(){

      },
      load(name){
         let type = 0;
          switch(name){
            case 'handling': type = 1;break;
            case 'handled': type = 2;break;
            case 'sended': type = 3;break;
          } 
          this.queryForm.type = type;
          this.columns = this['columns'+type];
          this.query();
      },
      startPro(){
        this.$router.push({path:'/workflow/start'}); 
      },
      handle(row){
        this.$router.push({path:'/workflow/process/redirect?forward&do=handle&inst=' + row.id +'&define='+row.defineId});
      }, 
      view(row){
        this.$router.push({path:'/workflow/process/redirect?forward&do=view&inst=' + row.id +'&define='+row.defineId});
      },
      logs(id){
        this.$refs.log.open(id);
        return;
      },
      edit(row){
        this.$router.push({path:'/workflow/process/redirect?forward&do=restart&inst=' + row.id +'&define='+row.defineId+'&businessKey='+row.businessKey});
      },
      reload(){
         console.log(this.name)
       this.load(this.name);
      },
      pageChange(page){
        var that = this;
        //将参数对象数据赋值个表单进行查询
        $.extend(that.queryForm,that.queryParam);
        this.load(this.name);
      },
      rowCommand: function (name, params) {
      if (name === '撤回') {
        let instId = params.row.instId
        let taskId = params.row.taskId
        this.$http.post('/api/wf/process/recall', {
          instId: instId,
          taskId: taskId
        }).then((res) => {
          if (res.data.code === 0) {
            this.$Message.success(res.data.message);
            this.load(this.name);
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        });
      }
      if (name === '撤销') {
        let instId = params.row.instId
        this.$http.post('/api/wf/process/revoke', {
          instId: instId
        }).then((res) => {
          if (res.data.code === 0) {
            this.$Message.success(res.data.message);
            this.load(this.name);
          } else {
            this.$Message.error(res.data.message)
          }
        }).catch((error) => {
          this.$Message.error(error.toString())
        });
      }
      if (name === '日志') {
        this.logs(params.row.id)
        return;
      }
    }
  },
  created(){
    this.$bus.$on('on-subwin-change',this.reload);
  },
  destroyed(){
    this.$bus.$off('on-subwin-change',this.reload);
  }
}
</script>
<style type="text/css"> 
   
</style>
