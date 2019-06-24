<template>
   <div class="wflogs">
     <div class="wflogs-title">审批日志</div>
      <table class="wflogs-table" cellspacing="0" cellpadding="0">
        <colgroup width="120"></colgroup>
        <colgroup ></colgroup>
        <colgroup width="120"></colgroup>       
        <colgroup width="120"></colgroup>
        <thead>
          <th>结点名称</th>
          <th>审批意见</th>
          <th>提交人</th>
          <th>提交时间</th>
        </thead>
        <tbody>
          <tr v-for="item in list">
            <td>{{item.curNodeName}}</td>
            <td>{{item.comment}}</td>
            <td>{{item.approverName}}</td>
            <td>{{item.createTime}}</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>
<script>
export default {
  components: {　
     
  },
  props: {     
    instId: {
      type: [Number,String],
      default: 0
    }
  },
  data() {
    return {
      list:[]
    }
  },
  mounted: function () {

  },
  computed: {},
  watch: {
    instId(val, old) {
      this.load(val);
    }
  },
  methods: {
    load(instId) {
      this.loading = 1;
      this.$http.get('/api/engine/workflow/instance/logs?id='+instId).then((res) => {
        this.loading = 0;
        if (res.data.code === 0) {
          var data = res.data.data;
          this.list = data;
        } else {
          this.$Message.error(res.data.message);
        }
      }).catch((error) => {
        this.loading = 0;
        this.$Message.error(error.toString())
      })
    },
  }
}

</script>

<style type="text/css">
  .page-bill .wflogs{    
  }

  .page-bill .wflogs-table{
    border-collapse:collapse;
  }

  .page-bill .wflogs-table td,.page-bill .wflogs-table th{
    height: 40px;
    border: 1px solid #dedede;
    text-align: center;
    padding: 0px 10px;
    white-space: nowrap;
  }

  .page-bill .wflogs-table th{
    background-color: #efefef;
  }
  .page-bill .wflogs-title{
    margin-top: 10px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    border-bottom: 0px solid #efefef;
    margin-bottom: 10px;
    color: #20bfee;
  }
</style>
