var user = {}; 
user.adminId = 0;
user.userId = ''; // 员工编号、微信 UserId
user.avatar='';
user.loginName = '';
user.isLogin = false;
user.isSuper = false;
user.powerKeys = [];
user.hasPower = function(key){
  if(key == '' || key == null || user.isSuper){
    return true;
  }
  for(var i = 0;i<user.powerKeys.length;i++){
    if(user.powerKeys[i] == key){
      return true;
    }
  }
  return false;
}
user.config = {};
user.config.default = {
  storageId:''
};
user.config.data = {};
user.config.load = function(data){
  user.config.data = Object.assign({},user.config.default,data);
}
user.config.save = function(){
  // 请替换此方法
}


export default user;