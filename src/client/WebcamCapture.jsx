import React from "react";
import Webcam from "react-webcam"; // handles getUserMedia() for access to camera and to take screenshots
import Quagga from 'quagga'; // handles image processing to read the barcode for our captures

// const corsEndpoint = 'https://cors-anywhere.herokuapp.com/'
class WebcamCapture extends React.Component {
  constructor() {
    super();
    this.state = {
      status: 'Waiting for an action'
    }
  }
  setRef = webcam => {
    this.webcam = webcam;
  };

  makeRequest = upc => {
    // first check if item exists
    fetch(`http://localhost:8080/checkitem/${upc.slice(1)}`)
      .then(response => response.json())
      .then(data => {
        // if it does, let the user know it's there
        if (!!data.length) {
          this.setState({ dataSrc: 'Item is already stored in your record' })
        } else {
          // if not, make another request to have the upc api get product information and store into db
          fetch(`http://localhost:8080/upc/${upc.slice(1)}`)
            .then(_ => this.setState({ dataSrc: 'New item added to database.' }))
        }
      });
  }

  // takes in base64/jpg uri and looks for barcode. If one is found, make a request to our db. 
  getUPC = src => {
    Quagga.decodeSingle({
      decoder: {
        readers: [
          'ean_reader',
          'ean_8_reader',
          'code_39_reader',
          'code_39_vin_reader',
          'codabar_reader',
          'upc_reader',
          'upc_e_reader',
          'i2of5_reader',
          '2of5_reader',
          'code_93_reader'
        ],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanLine: true,
          showPattern: true
        }
      },
      numOfWorkers: 4,
      frequency: 40,
      locate: true,
      locator: {
        halfSample: true,
        patchSize: 'x-large'
      },
      debug: true,
      src
    }, (result) => {
      if (!!result) {
        console.log(result.codeResult);
        this.makeRequest(result.codeResult.code);
      } else {
        this.setState({ dataSrc: 'Issue reading barcode. Try again.' })
      }
    })
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.getUPC(imageSrc);
  };

  render() {
    const videoConstraints = {
      width: 1920,
      height: 1080,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          height={600}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={800}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Search By UPC</button>

        <p>{'Status: ' + this.state.status}</p>
      </div>
    );
  }
}

export default WebcamCapture;