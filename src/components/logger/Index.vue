<template>
  <ListPage ref="page" title="系统日志" api="/api/engine/operLog/list" 
  :model="this" :beforeLoad="beforeLoad">
    <div class="page-tools">
      <table cellpadding="0" cellspacing="0">
        <tr>  
          <td class="page-tools">
            <Button @click="clear" v-power icon="ios-trash-outline">日志清理</Button>&nbsp;
          </td>
        </tr>
      </table>
    </div>
    <div class="page-searchbox">
      <table cellpadding="0" cellspacing="0">
        <tr> 
          <td>
            日志类型
          </td>
          <td>
            <Select v-model="queryForm.action" style="width: 160px">
              <Option v-for="item in action" :value="item.code" :key="item.code">{{ item.text }}</Option>
            </Select>
          </td> 
          <td>操作模块</td>
          <td>
            <Input v-model="queryForm.module"  placeholder="操作模块" @on-enter="query"/>
          </td> 
          <td>发生日期</td>
          <td>
            <DatePicker
              type="daterange"
              v-model="queryForm.createTime"
              split-panels
              placeholder="发生日期"
              style="width: 180px"
              :clearable="true"
              ::transfer="true"
            ></DatePicker>
          </td>     
          <td>
            <Button @click="query"  type="primary" icon="ios-search">查询</Button>
          </td>
          <td>
            <Button @click="reset"  type="default">重置</Button>
          </td>
        </tr>
      </table>
    </div>
  </ListPage> 
</template>
<script>    
  import ListPage from '@/components/page/ListPage';
  import DataRowOperate from '@/components/commons/DataRowOperate';
  import page from '@/assets/js/page';

  export default {
    components: {
      ListPage,
      DataRowOperate,
    },
    data() {
      let that = this;
      return {
        columns: [
          {
            title: '序号',
            width: 100,
            type:'index',
            align: 'center',
          },
          {
            title: '操作类型',
            key: 'action',
            width:100,
          }, 
          {
            title: '操作模块',
            key: 'module',
            width:150,
          }, 
          {
            title: '操作内容',
            key: 'content',
            align: 'left',
            minWidth:150
          },
          {
            title: '操作ip',
            key: 'ip',
            align: 'left',
            width:120
          },
          {
            title: '操作位置',
            key: 'location',
            align: 'left',
            width:120
          },
          page.table.initMapColumn({
            title: '操作来源',
            key: 'terminal',
            data: {
              '1': 'PC端',
              '2': 'APP',
            }
          }),
         {
            title: '操作人',
            key: 'creatorName',
            align: 'center',
            width: 100,
          }, 
          {
            title: '操作时间',
            key: 'createTime',
            align: 'center',
            width: 160,
          },
        ],
        queryParam: {},
        queryForm: {
          action: '',
          module:'',
          createTime:[page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
        },
        action:[
          {code:'登录',text:'登录'},
          {code:'添加',text:'添加'},
          {code:'编辑',text:'编辑'},
          {code:'删除',text:'删除'},
        ],
        selection: [],
        loading: 0
      }
    },
    mounted: function () {
      this.reset();
    },
    computed: {},
    methods: {
      beforeLoad(){
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
      query() { 
        this.$refs.page.query();
      },
      reset: function () {
        Object.assign(this.queryForm, {
          action: '',
          module:'',
          createTime: [page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 60)), page.formatDate(new Date())]
        });
        this.query();
      },
      clear: function () {
        var time=page.formatDate(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365));
        this.$Modal.confirm({
          title: '清理确认',
          content: '<p>此操作将删除'+time+'前的所有系统日志，删除后不能恢复，确定执行吗？</p>',
          onOk: () => {               
            this.$http.post('/api/engine/operLog/delete',{createTime:time}).then((res) => {
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
      },
    }
  }

</script>

<style type="text/css">

</style>
