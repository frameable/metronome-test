void function main() {

  document.write(`
    <audio autoplay controls></audio>
    <script src="/adapter-latest.js"></script>
  `);

  const audioElement = document.querySelector('audio');

  let pc1, pc2;

  function start() {

    window.AudioContext = window.AudioContext;
    const context = new AudioContext();

    const stream = context.createMediaStreamDestination().stream;

    pc1 = new RTCPeerConnection();
    pc2 = new RTCPeerConnection();
    pc2.ontrack = gotRemoteStream;
    stream.getTracks().forEach(track => pc1.addTrack(track, stream));
    pc1.createOffer().then(gotDescription1).catch(error => console.warn);
  }

  function gotDescription1(desc) {
    pc1.setLocalDescription(desc);
    pc2.setRemoteDescription(desc);
    pc2.createAnswer()
      .then(gotDescription2)
      .catch(error => console.warn);
  }

  function gotDescription2(desc) {
    pc2.setLocalDescription(desc);
    pc1.setRemoteDescription(desc);
  }

  function gotRemoteStream(e) {
    if (audioElement.srcObject !== e.streams[0]) {
      audioElement.srcObject = e.streams[0];
    }
  }

  start();

}();
