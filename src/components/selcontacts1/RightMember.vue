<template>
  <ListPage ref="page" title="" api="/api/contacts/emp/list" 
  :model="this" :beforeLoad="beforeLoad" :checkIds="checkIds" :idPath="idPath" :enableCheckStatus="true"> 
      <div class="page-searchbox">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <span class="member-count">已选择人员 <span style="color:#999;">（共{{checkIds.length}}人）</span></span>
            </td>
            <td width="1%">
              <Select v-model="queryForm.status" @on-change="query" >
                <Option v-for="item in status" :value="item.value" :key="item.index">{{ item.label }}</Option>
              </Select>
            </td>
            <td width="1%">
               <Input v-model="queryForm.keyword" placeholder="搜索姓名/手机号" style="width:150px" @on-enter="query" />
            </td>
            <td width="1%">
              <Button icon="ios-search" type="primary" @click="query">查询</Button>
            </td>
          </tr>
        </table>
      </div> 
  </ListPage> 
</template>
<script>  
import ListPage from '@/components/page/ListPage'; 
export default {
  components: {
    ListPage, 
  },
  props: {
    checkIds:{
      type:Array,
      default:()=>{
        return [];
      }
    },
    idPath:{
      type:String,
      default:()=>{
        return 'empId';
      }
    },
  },
  data() {
    var that = this;
    return { 
      columns:[
        {
            type: 'selection',
            width: 40,
            align: 'center'
        },
        {
            title: '姓名',
            align: 'center',
            width:160,
            render: (h,params)=>{

              return h('Row',{
                      props:{type:'flex',justify:'center',align:'middle'},
                    },
                    [
                     h('Col',{props:{span:'3'}},[
                         h('img',{attrs:{src:that.follow(params.row.status),style:'width:12px;height:12px;margin-top:6px;'}})
                      ]),
                    h('Col',{props:{span:'6'}},[
                        h('Avatar',{
                         props:{src:params.row.header,shape:'circle',icon:'person'}
                        })
                      ]
                    ),
                    h('Col',{props:{span:'1'}},[
                    ]),
                    h('Col',{props:{span:'9','class-name':'truename-col-span'}},[
                      h('span',params.row.trueName)
                    ])
                  ]
              );
            }
        }, 
        {
            title: '性别',
            key: 'sexName',
            align: 'center',
            width:60
        },
        {
           title: '手机号',
            key: 'mobile',
            align: 'center',
            width:120
        },
        {
            title: '部门',
            key: 'deptName',
            align: 'left'
        }
      ],
      status: [
        { value: -1, label: '全部成员'},
        { value: 1, label: '已关注'},
        { value: 0, label: '未关注'}
      ],
      queryForm:{
        //1=已激活，2=已禁用，0=未激活
        status:-1,
        keyword:'', 
        //部门ID
        deptId: 1
      }, 
    }
  },
  mounted:function(){
    this.query();
  },
  computed:{
     
  },
  methods:{
    query() {
      this.$refs.page.query();
    }, 
    beforeLoad(){

    },
    reset() {
      Object.assign(this.queryForm,{
        keyword: '',
        industry:'',
      });
      this.query();
    },
    follow: function(status){
        if(status ===1 ) {
          return require('../../assets/img/icon-follow.png');
        }
        return require('../../assets/img/icon-unfollow.png');
    }
  }
}

</script>

<style type="text/css">
   

</style>

