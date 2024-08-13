
import { Writable, WritableOptions } from "node:stream";
import { Buffer } from "node:buffer"

class WritableBufferStream extends Writable {
    _chunks: Uint8Array[]

    constructor(options: WritableOptions) {
        super(options);
        this._chunks = [];
    }

    _write (chunk: Buffer, encoding: string, callback: CallableFunction) {
        this._chunks.push(chunk);
        return callback(null);
    }

    _destroy(err: Error, callback: CallableFunction) {
        this._chunks = [];
        return callback(null);
    }

    toBuffer() {
        return Buffer.concat(this._chunks);
    }
}

export { WritableBufferStream }