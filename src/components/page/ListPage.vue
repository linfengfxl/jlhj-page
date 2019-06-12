<template>
<Layout ref="layout" @on-size-change="setHeight"> 
  <div slot="top" class="page">
    <slot name="page-title" v-if="showSlotPageTitle"></slot>
    <div class="page-title" v-if="title && !showSlotPageTitle">
      {{title}}
    </div>
    <slot></slot>
  </div>
  <div class="page" style="padding-top: 0px;">
    <Loading :loading="loading">
      <div class="page-datatable" style="padding-top: 0px;">
        
        <div :style="slotTableStyle" v-if="showSlotTable">
          <slot name="page-table"></slot>
        </div> 

        <i-table ref="table" v-else  :columns="model.columns" 
          :disabled-hover="false" 
          :highlight-row="true"
          @on-current-change="currentChange"
          @on-selection-change="select"
          :data="list" :height="tableHeight" :row-class-name="rowClassName" @on-row-click="rowClick"></i-table> 

        <div style="height:10px;"></div>
        <Page ref="pagebar" :total="total" size="small" :page-size-opts="[10,20,30,50,100]"
            @on-page-size-change="pageSizeChange" @on-change="pageChange" show-sizer placement="top" :transfer="true" show-total show-elevator></Page> 
        <div style="height:10px;" v-if="$slots['page-datatable-detail']"></div>
        <slot name="page-datatable-detail"></slot>
      </div>
    </Loading>
  </div>
</Layout>
</template>
<script>
  import Layout from '@/components/layout/Layout';
  import Loading from '@/components/loading'; 

  export default {
    components: { 
      Loading, 
      Layout
    },
    props:{
      model:{
        type:Object,
        default:()=>{
          return {};
        }
      },
      checkIds:{
        type:Array,
        default:()=>{
          return [];
        }
      },
      idPath:{ // 选中行数据标识
        type:String,
        default:'id'
      },
      enableCheckStatus:{ // 开启跨页选中状态
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default:'列表查询页面'
      },
      api:{
        type:String,
        default:'/api/inquire/list'
      },
      apiDetail:{
        type:String,
        default:'/api/inquire/list'
      },
      // 委托
      beforeLoad: {
        type: Function,
        default () {
            return '';
        }
      },
    },
    data() { 
      return { 
        queryParam:{},
        queryForm:this.model.queryForm || {},
        list: [],
        total:0,
        loading: 0,
        tableHeight:100, 
        showSlotPageTitle:true && this.$slots['page-title'], 
        // 当前行对象
        currentRow:null,
        _loaded:false
      }
    },
    computed: {
      slotTableStyle(){
        return {
          height:this.tableHeight + 'px'
        };
      },
      showSlotTable(){
        return true && this.$slots['page-table'];
      }
    },
    mounted(){
      this._isMounted = true;
    },
    activated(){
      if(!this._isMounted && this._loaded){
        this.load();
      }else{
        this._isMounted = false;
      }
    },
    methods: {
      load() { 
        this._loaded = true;
        var pagebar = this.$refs.pagebar;
        this.loading = 1;
        this.queryParam.page = pagebar.currentPage;
        this.queryParam.pageSize = pagebar.currentPageSize;
        this.$http.post(this.api, this.queryParam).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) { 
            this.loading = 0;
            var data = res.data.data; 
            data.rows.map((row)=>{
              row._checked = false;
              if(this.enableCheckStatus){
                if(typeof(row[this.idPath]) != 'undefined'){
                  row._checked = this.checkIds.indexOf(row[this.idPath])>=0;
                }
              }
            });
            this.$emit('on-load-data',data.rows);
            this.list = data.rows;
            if(this.list.length > 0){
              this.list[0]._highlight = true;
              this.currentChange(this.list[0],this.currentRow);
            }else{
              this.currentChange(null,this.currentRow);
            }
            this.total = data.total; 
            Object.assign(this.queryForm, this.queryParam);
            this.$emit('on-load');
          } else {
            this.loading = 0;
            this.list = [];
            this.total = 0;
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新发送")
        });
      },
      //public
      query() {
        var pagebar = this.$refs.pagebar;
        pagebar.current = 1;
        pagebar.currentPage = 1;
        pagebar.currentPageSize = 10;
        Object.assign(this.queryParam,this.queryForm);
        this.beforeLoad(this);          
        this.load();
      }, 
      //public
      reset() {
        Object.assign(this.queryForm,{});
        var pagebar = this.$refs.pagebar;
        pagebar.current = 1;
        pagebar.currentPage = 1;
        pagebar.currentPageSize = 10;
        this.query();
      },
      exportDown(){
        var pagebar = this.$refs.pagebar;
        this.loading = 1;         
        this.$http.post(this.api, Object.assign({},this.queryParam,{_action:'export'})).then((res) => {
          this.loading = 0;
          if (res.data.code === 0) { 
            this.loading = 0;
            var data = res.data.data;
            window.open(this.$http.defaults.baseURL + '/api/file/download?fileId=' + data);
          } else {
            this.loading = 0;             
            this.$Message.error(res.data.message);
          }
        }).catch((error) => {
          this.loading = 0;
          this.$Message.error("请求失败，请重新发送")
        });
      },
      //public
      getSelection(){
        return this.$refs.table.getSelection();
      },
      pageChange(page) {
        this.load();
      },
      pageSizeChange(pageSize){
        var pagebar = this.$refs.pagebar;
        if(pagebar.currentPage == 1){
          this.load();
        }
      },
      setHeight(){
        var detail = this.$slots['page-datatable-detail'];
        var height = this.$refs.layout.center.height;
        if(detail){ 
          this.tableHeight = (height-50)/2;
          if(detail[0].componentInstance){
            detail[0].componentInstance.height = (height-50)/2;
          }
        }else{
          this.tableHeight = this.$refs.layout.center.height - 50;
        } 
      },
      rowClassName(row, index){ 
         
      },
      rowClick(row,index){
        this.$emit('onRowClick',row,index);
      },
      currentChange(currentRow,oldCurrentRow){ 
        this.currentRow = currentRow;
        this.$emit('onCurrentRowChange',currentRow,oldCurrentRow);
      },
      select(sels){
        var checks = {};
        sels.map((sel)=>{
          if(typeof(sel[this.idPath]) != 'undefined'){
            checks[sel[this.idPath]+''] = 1;
          }
        });
        this.list.map((item)=>{
          if(typeof(item[this.idPath]) != 'undefined'){
            if(this.enableCheckStatus){
              this.inner_setCheck(item[this.idPath],checks[item[this.idPath]+'']);
            } 
          }
        });
      },
      inner_setCheck(id,check){
        if(check){
          if(this.checkIds.indexOf(id)<0){
            this.checkIds.push(id);
          }
        }else{
          var index = this.checkIds.indexOf(id);
          while(index>=0){ 
            this.checkIds.splice(index,1);
            index = this.checkIds.indexOf(id);
          }
        }
      }
    }
  }

</script>

<style type="text/css">
  .page .table-row-cur td{
    border:1px solid #ffd7d6;
    border-left: 0px;
    border-right: 0px;
    background-color: #ffebea;
  }
</style>