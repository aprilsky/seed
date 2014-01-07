var pg = require('pg');
var querystring = require("querystring");
var  url = require("url");


exports.getTrainAdminDetail_ = function(){
    _this = this;
    var arg = url.parse(this.req.url).query;   //arg1 => {name:'a',id:'5'}
    var corpCode = querystring.parse(arg).corpCode;         //name => a
    var omsConString = "tcp://eln4user:elnforuser@123.103.18.73:5434/oms";
    getUcClientAndRenderJson(omsConString,corpCode);
};

var renderJson = function (ucClient,corpCode) {
    //得到这个公司下的所有培训管理员的工号，姓名，email,电话
    ucClient.connect(function(err){
        checkError(err);
        var userDetailSql = 'select  u.employee_code,u.user_name,ud.email,ud.mobile from t_uc_user_role_rel urr ' +
            ' INNER JOIN t_uc_user_detail ud on urr.user_id = ud.user_id  ' +
            ' inner join t_uc_user u on u.user_id = ud.user_id' +
            ' where urr.role_id = \'402880593604ea49013605e3208602f2\' and urr.corp_code = \''+corpCode+'\';';
        ucClient.query(userDetailSql,function(err,detailResult){
            checkError(err);
            _this.renderJson(detailResult.rows);
            ucClient.end();
        });

    });
};


function getUcClientAndRenderJson(omsConString,corpCode) {
    var omsClient = new pg.Client(omsConString);
    omsClient.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var sql ='SELECT odb.database_name,odb.host_port,odb."password",odb.user_name  from t_oms_corp_datasource ocd INNER JOIN t_oms_corp oc on ocd.corp_id = oc.corp_id INNER JOIN t_oms_datasource ods on ocd.datasource_id = ods.datasource_id inner join t_oms_database odb on ods.database_id = odb.database_id and oc.database_pool_id = odb.pool_id where ods.project_group_code = \'uc\' and oc.corp_code = \''+corpCode+'\';';
        omsClient.query(sql, function(err, result) {
            if(err) {
                return console.error('error running query', err);
            }
            var userName = result.rows[0].user_name;
            var password = result.rows[0].password;
            var hostPort = result.rows[0].host_port;
            var databaseName = result.rows[0].database_name;
            var ucConString = "tcp://"+userName+":"+password+"@"+hostPort+"/"+databaseName;
            omsClient.end();
            var ucClient =  new pg.Client(ucConString);
            renderJson(ucClient,corpCode);
        });

    });
}



checkError = function(err){
    if(err) {
        return console.error('error running query', err.stack);
    }
}



/*

exports.getTrainAdminDetail = function(){
    var _this = this;
    var arg = url.parse(this.req.url).query;   //arg1 => {name:'a',id:'5'}
    var corpCode = querystring.parse(arg).corpCode;         //name => a
    var omsConString = "tcp://eln4user:elnforuser@123.103.18.73:5434/oms";
    var omsClient = new pg.Client(omsConString);
    omsClient.connect(function(err) {
        if(err) {
            return console.error('could not connect to postgres', err);
        }
        var sql ='SELECT odb.database_name,odb.host_port,odb."password",odb.user_name  from t_oms_corp_datasource ocd INNER JOIN t_oms_corp oc on ocd.corp_id = oc.corp_id INNER JOIN t_oms_datasource ods on ocd.datasource_id = ods.datasource_id inner join t_oms_database odb on ods.database_id = odb.database_id and oc.database_pool_id = odb.pool_id where ods.project_group_code = \'uc\' and oc.corp_code = \''+corpCode+'\';';

        omsClient.query(sql, function(err, result) {
            checkError(err);
            var userName = result.rows[0].user_name;
            var password = result.rows[0].password;
            var hostPort = result.rows[0].host_port;
            var databaseName = result.rows[0].database_name;
            var ucConString = "tcp://"+userName+":"+password+"@"+hostPort+"/"+databaseName;
            var ucClient = new pg.Client(ucConString);
            ucClient.connect(function(err){
                checkError(err);
                var ucSql = 'select ggr.* from t_uc_organize o INNER JOIN t_uc_gen_group_role ggr on o.organize_id = ggr.refer_id where o.organize_name like \'%个人%\' and o.corp_code= \''+corpCode+'\';';
                ucClient.query(ucSql,function(err,ucResult){
                    if(err) {
                        return console.error('error running query', err);
                    }
                    if(ucResult.rows.length==0){
                        var userDetailSql = 'select  ud.* from t_uc_user_role_rel urr INNER JOIN t_uc_user_detail ud on urr.user_id = ud.user_id  where urr.role_id = \'402880593604ea49013605e3208602f2\' and urr.corp_code = \''+corpCode+'\';';
                        ucClient.query(userDetailSql,function(err,detailResult){
                            if(err) {
                                return console.error('error running query', err);
                            }
                            console.log(detailResult.rows);
                            _this.renderJson(detailResult.rows);
                        });
                    }else{
                        console.log('个人的部门下有培训管理员');
                    }
                    ucClient.end();
                });
            });
            omsClient.end();
        });
    });

};


*/




