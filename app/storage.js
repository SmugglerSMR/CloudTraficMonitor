var	mysql = require('mysql'), 
    config = require('./config');

var mysqlPool = mysql.createPool(config.MYSQL);

// Creating table with following commands:

// CREATE SCHEMA `cab432` DEFAULT CHARACTER SET utf8mb4 ;
// CREATE TABLE `cab432`.`images` (`id` INT(10) NOT NULL AUTO_INCREMENT, `state` INT(3) NULL DEFAULT 0, `webcam_id` INT(10) NOT NULL, `image_url` VARCHAR(255) NOT NULL, `createtime` DATETIME NOT NULL, `data` MEDIUMTEXT NULL, `result` MEDIUMTEXT NULL, PRIMARY KEY (`id`), INDEX `state` (`state` ASC));


// --------------------------------------------------------------------
exports.add = function (params, callback) {

    mysqlPool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
  
      connection.query( "INSERT INTO `images` SET "
                          +"  `state` = 1 "
                          +", `webcam_id` = ? "
                          +", `image_url` = ? "
                          +", `createtime` = NOW() "
                          +", `data` = ? ",
  
                [ params.webcamId, params.imageUrl, params.data ],
    
                function( error, data ){
    
                    connection.release();

                    if (error) throw error;

                    if(error){
                        console.log(error);
                        callback( false, 0 );
                    }
                    else {
                        var id = data.insertId;
                        callback( true, id );
                    }  
                });  
    });      
};

// --------------------------------------------------------------------
exports.get_state = function (state, callback) {

    mysqlPool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!

        connection.query( "SELECT * FROM `images` WHERE `state` = ? ",
                [ state ],
                function( error, data ){

                var list = [];
                var items = [];

                for (var i=0; i<data.length; i++) {

                    list.push(data[i].id);

                    items.push({  id:       data[i].id,
                                webcamId: data[i].webcam_id,
                                data:     data[i].data
                                });

                }

                connection.query( "UPDATE `images` SET `state` = 2 WHERE `id` IN ("+list.join(',')+")",
                            function( error, res ){
                                console.log('--- images  state = 2 ---', list.join(','));
                                connection.release();
                            });
                callback(items);
                });
    });
};

// --------------------------------------------------------------------
exports.update = function (params, callback) {

    mysqlPool.getConnection(function(err, connection) {
  
      if (err) throw err; // not connected!
  
      connection.query( "UPDATE `images` SET `state` = 3, `result` = ? WHERE `id` = ? ",
  
                [ JSON.stringify(params.result), params.id ],  
                function( error, res ){  
                        connection.release();
                        callback();
                });
    });
};

// --------------------------------------------------------------------
exports.set_error = function (id, callback) {

    mysqlPool.getConnection(function(err, connection) {
  
        if (err) throw err; // not connected!

        connection.query( "UPDATE `images` SET `state` = 4 WHERE `id` IN = ?",
                [ id ],
                function( error, res ){
                        console.log('--- images  state = 2 ---', list.join(','));
                        connection.release();
                        callback();
                });  
    });
    
};