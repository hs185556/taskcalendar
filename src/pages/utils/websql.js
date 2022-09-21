let dataBase = null;

var websql = {
	/**
	 * 打开数据库
	 * @param dbname 数据库名
	 * @params version 版本 1.0
	 * @params dbdesc 数据库描述
	 * @param dbsize 数据库大小 10*1024*1024
	 * @returns  dataBase:打开成功   null:打开失败
	 */
	openDB : function(dbname, version, dbdesc, dbsize){
	    /*数据库有就打开 没有就创建*/
	    dataBase = window.openDatabase(dbname, version, dbdesc, dbsize,function() {});
	    if (dataBase) {
	        console.log("数据库创建/打开成功!");
	    } else{
	        console.log("数据库创建/打开失败！");
	    }
	    return dataBase;
	},
	createTable : function(tableName,fields){
		/*数据库表没有就创建*/
		// var createTableSQL = 'Drop table task';
		var createTableSQL = 'CREATE TABLE IF  NOT EXISTS '+ tableName + "(" + fields + ")";
		console.log('executeSql',createTableSQL);
	    dataBase.transaction(function (ctx,result) {
	        ctx.executeSql(createTableSQL,[],function(ctx,result){
	            console.log("表创建成功 " + tableName);
	        },function(tx, error){ 
	            console.log('创建表失败:' + tableName + error.message);
	        });
	    });
	},
	exe:function(sqlStatement,fieldArr,callback){
		console.log('----------executeSql------------',sqlStatement,fieldArr);
		dataBase.transaction(function (ctx) {
	        ctx.executeSql(sqlStatement,fieldArr,function (ctx,result){
	        	if(callback)callback(result);
	        },function (tx, error) {
	            console.log(error.message);
	        });
	    });
	},
	exeSync:function(sqlStatement,fieldArr){
		console.log('----------executeSql------------',sqlStatement,fieldArr);
		return new Promise((res,rej)=>{
			dataBase.transaction(function (ctx) {
				ctx.executeSql(sqlStatement,fieldArr,function (ctx,result){
					res(result);
				},function (tx, error) {
					console.log(error.message);
					rej(error);
				});
			});
		})
	},
}
module.exports = websql;