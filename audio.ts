if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");

    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then((stream) => {
        const mediaRecorder: MediaRecorder = new MediaRecorder(stream);
        
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }




