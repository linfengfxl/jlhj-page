var args = {};
args.argMap = {};
args.getArgText = function(group,code){
  if(group == '' || group == null || code == '' || code == null || args.argMap == null){
    return '';
  }
  let resText = code.toString();
  for(var key in args.argMap){
    if(key == group){
      let groupArgs = args.argMap[key];
      if(groupArgs !=null){
        for(var i=0;i< groupArgs.length;i++){
          let e = groupArgs[i]
          if(e.argCode == code){
            resText = e.argText;
            break;
          }
        }
      }
    }
  }
  return resText;
}
args.getArgGroup = function(group){
  return args.argMap[group] || [];
}
args.getEmpName = function (empId) {
  return args.getArgText('empList',empId);
}
args.getDeptName = function (deptId) {
  return args.getArgText('deptList',deptId);
}
args.getRoleName = function (roleId) {
  return args.getArgText('roleList',roleId);
}


export default args;