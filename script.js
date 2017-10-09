var audio = document.getElementById('audio');

var mse = new MediaSource();
var buffer;
mse.addEventListener('sourceopen', onMSEInit, false);
audio.src = URL.createObjectURL(mse);

audio.addEventListener('canplaythrough', () => {
  console.log('calling play()');
  audio.play();
});

function onMSEInit() {
  buffer = mse.addSourceBuffer('audio/mp4');
  buffer.mode = 'sequence';
  buffer.addEventListener('updateend', onUpdateEnd, false);
  onUpdateEnd();
}

var urls = [
  'segments/segment0.m4a',
  'segments/segment1.m4a'
];

function onUpdateEnd() {
  var url = urls.shift();
  if (!url) {
    console.log('Done.');
    return;
  }
  
  console.log('Prepare', url)
  downloadData(url, function(data) {
    console.log('Downloaded')
    buffer.appendBuffer(data);
  });
}

function downloadData(url, cb) {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    cb(arrayBuffer);
  };
  oReq.send(null);
}
