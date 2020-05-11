var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

var conn = mongoose.connection;

var path = require("path");

var Grid = require("gridfs-stream");

var fs = require("fs-extra");

var Grid = require("gridfs-stream");

Grid.mongo = mongoose.mongo;

exports.getFile = function(req, res, next) {

    let url = decodeURI(req.originalUrl);

    var fileIDIndex = url.indexOf("/id/");

    var fileID = url.substring(fileIDIndex + 4, url.length);

    var fileIDSlash = fileID.indexOf("/");

    fileID = fileID.substring(0, fileIDSlash);

    var filesIndex = url.indexOf("/files/");

    var filename = url.substring(filesIndex + 7, url.length);

    // check if the id and filesname are undefined 

    if (fileID === 'undefined' || filename === 'undefined') {
        res.status(404).send('File Not Found');
        return;
    }
    
    var gfs = Grid(conn.db);

    gfs.exist({ _id: fileID, filename: filename }, (err, file) => {
        
        if (err || !file) {
            // send proper 404 json response
            res.status(404).send('File Not Found');
            return;
        }

        var newPath = path.join(__dirname, '../temp/' + filename);

        var fs_write_stream = fs.createWriteStream(newPath);

        var readstream = gfs.createReadStream({
            // the name of the file in database
            _id: fileID,
            filename: filename
        });

        readstream.pipe(fs_write_stream);

        // pipe out the file retrieved from mongoDB and allow user to view 
        readstream.pipe(res);

        // instead of a try, make a promise 
        // then try
	    try {
	    	fs.unlinkSync(newPath)
	    	//console.log("file removed from temp directory");
	      } catch(err) {
	    	console.error("File removal error: " + err)
        }

    });
    
}