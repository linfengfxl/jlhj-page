<template>
  <div class="page">页面跳转中...</div>
</template>
<script>

import defineCfg from '@/components/workflow/defineCfg'

export default {
  components: {
  },
  data() {
    return {

    }
  },
  mounted: function () {
    this.goRedirect();
  },
  computed: {},
  methods: {
    goRedirect() {
      var action = this.$route.query.do;
      var instId = this.$route.query.inst;
      var defineId = this.$route.query.define;
      var businessKey = this.$route.query.businessKey; 
      

      var form = defineCfg.getFormByDefine(defineId);
      if(form == null){
        this.$Message.error('未知的流程定义 ' + defineId);
        this.$router.go(-1);
        return;
      }

      var url = '';


      if (action == 'handle') { 
        url = form.handleUrl;        
      }

      if (action == 'restart') { 
        url = form.startUrl;
      } 

      if (action == 'view') { 
        url = form.viewUrl;        
      } 

      if (url) {
        url += '?forward&inst=' + instId;
        if(action == 'restart'){
          url += '&id=' + businessKey;
        }

        this.$router.replace({
          path: url
        })
      } else {
        this.$Message.error('表单未配置 url');
        this.$router.go(-1);
      }
    },
  }
}

</script>

<style type="text/css">
.wfprocess {
  height: 100%;
  overflow: hidden;
  padding-top: 42px;
}
.wfprocess-header {
  height: 42px;
  padding-left: 10px;
  line-height: 42px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  margin-top: -42px;
  background-color: #f9fafb;
  text-align: center;
}
.wfprocess-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.wfprocess-bill {
  max-width: 1000px;
  min-width: 600px;
  margin: 0px auto;
  padding: 15px 10px 195px 15px;
}
.wfprocess-footer {
  height: auto;
  width: 100%;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.wfprocess-footer-body {
  padding: 4px 10px;
  font-size: 14px;
  max-width: 1000px;
  min-width: 600px;
  margin: 0px auto;
}

.wfprocess-footer td {
  padding: 4px;
}

.wfprocess-footer .nodes li {
  display: block;
  padding: 4px 8px;
  border: 1px solid #eee;
  border-radius: 3px;
  float: left;
  margin-right: 10px;
}
.wfprocess-footer .label {
  width: 70px;
  text-align: right;
  padding-right: 10px;
}
</style>
