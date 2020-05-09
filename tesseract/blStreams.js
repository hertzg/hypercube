const { BufferListStream } = require("bl");
const Async = require("async");

const blStreams = (streams, callback) =>
  Async.parallel(
    Object.fromEntries(
      Object.entries(streams).map(([name, stream]) => {
        return [
          name,
          done => {
            stream.pipe(BufferListStream(done));
          }
        ];
      })
    ),
    callback
  );

module.exports = blStreams;
