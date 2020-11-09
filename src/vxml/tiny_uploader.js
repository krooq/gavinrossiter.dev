/*
 * Valid options are:
 * - chunk_read_callback: a function that accepts the read chunk
                          as its only argument. If binary option
                          is set to true, this function will receive
                          an instance of ArrayBuffer, otherwise a String
 * - error_callback:      an optional function that accepts an object of type
                          FileReader.error
 * - success:             an optional function invoked as soon as the whole file has been
                          read successfully
 * - binary:              If true chunks will be read through FileReader.readAsArrayBuffer
 *                        otherwise as FileReader.readAsText. Default is false.
 * - chunk_size:          The chunk size to be used, in bytes. Default is 64K.
 */
function parseFile(file, options) {
    var opts = typeof options === 'undefined' ? {} : options;
    var fileSize = file.size;
    var chunkSize = typeof opts['chunk_size'] === 'undefined' ? 64 * 1024 : parseInt(opts['chunk_size']); // bytes
    var binary = typeof opts['binary'] === 'undefined' ? false : opts['binary'] === true;
    var offset = 0;
    var readBlock = null;
    var chunkReadCallback = typeof opts['chunk_read_callback'] === 'function' ? opts['chunk_read_callback'] : function () { };
    var chunkErrorCallback = typeof opts['error_callback'] === 'function' ? opts['error_callback'] : function () { };
    var success = typeof opts['success'] === 'function' ? opts['success'] : function () { };

    var onLoadHandler = function (evt) {
        if (evt.target.error == null) {
            offset += evt.target.result.length;
            chunkReadCallback(evt.target.result);
        } else {
            chunkErrorCallback(evt.target.error);
            return;
        }
        if (offset >= fileSize) {
            success(file);
            return;
        }

        readBlock(offset, chunkSize, file);
    }

    readBlock = function (_offset, length, _file) {
        var r = new FileReader();
        var blob = _file.slice(_offset, length + _offset);
        r.onload = onLoadHandler;
        if (binary) {
            r.readAsArrayBuffer(blob);
        } else {
            r.readAsText(blob);
        }
    }

    readBlock(offset, chunkSize, file);
}

export default parseFile;