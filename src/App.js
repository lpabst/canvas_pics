import "./App.css";
import { useEffect, useState } from "react";

const image1Url = "./landscape1.jpeg";
const image2Url = "./landscape2.jpeg";
const image3Url = "./landscape3.jpeg";

function App() {
  const canvasWidth = 600;
  const canvasHeight = 600;
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();

  // state vars
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);
  const [image3Loaded, setImage3Loaded] = useState(false);
  const [ctx1, setCtx1] = useState(null);
  const [ctx2, setCtx2] = useState(null);
  const [ctx3, setCtx3] = useState(null);
  const [ctx4, setCtx4] = useState(null);
  const [ctx5, setCtx5] = useState(null);
  const [ctx6, setCtx6] = useState(null);
  const [ctx7, setCtx7] = useState(null);
  const [ctx8, setCtx8] = useState(null);
  const [ctx9, setCtx9] = useState(null);

  // when the component loads, load up the canvas contexts
  useEffect(() => {
    const c1 = document.getElementById("c1");
    const c2 = document.getElementById("c2");
    const c3 = document.getElementById("c3");
    const c4 = document.getElementById("c4");
    const c5 = document.getElementById("c5");
    const c6 = document.getElementById("c6");
    const c7 = document.getElementById("c7");
    const c8 = document.getElementById("c8");
    const c9 = document.getElementById("c9");
    setCtx1(c1.getContext("2d"));
    setCtx2(c2.getContext("2d"));
    setCtx3(c3.getContext("2d"));
    setCtx4(c4.getContext("2d"));
    setCtx5(c5.getContext("2d"));
    setCtx6(c6.getContext("2d"));
    setCtx7(c7.getContext("2d"));
    setCtx8(c8.getContext("2d"));
    setCtx9(c9.getContext("2d"));
  }, []);

  // when ctx1 becomes available, load/draw image 1 on it
  useEffect(() => {
    if (!ctx1) return;
    img1.addEventListener(
      "load",
      function () {
        console.log("image 1 loaded");
        ctx1.drawImage(img1, 0, 0, 600, 600, 0, 0, 600, 600);
        setImage1Loaded(true);
      },
      false
    );
    img1.src = image1Url;
  }, [ctx1]);

  // when ctx2 becomes available, load/draw image 2 on it
  useEffect(() => {
    if (!ctx2) return;
    img2.addEventListener(
      "load",
      function () {
        console.log("image 2 loaded");
        ctx2.drawImage(img2, 0, 0, 600, 600, 0, 0, 600, 600);
        setImage2Loaded(true);
      },
      false
    );
    img2.src = image2Url;
  }, [ctx2]);

  // when ctx3 becomes available, load/draw image 3 on it
  useEffect(() => {
    if (!ctx4) return;
    img3.addEventListener(
      "load",
      function () {
        console.log("image 3 loaded");
        ctx3.drawImage(img3, 0, 0, 600, 600, 0, 0, 600, 600);
        setImage3Loaded(true);
      },
      false
    );
    img3.src = image3Url;
  }, [ctx3]);

  // when all 3 images and all of the canvases load, do some pixel rgb magic
  useEffect(() => {
    // wait until all 3 images load and the contexts are available
    if (
      !image1Loaded ||
      !image2Loaded ||
      !image3Loaded ||
      !ctx1 ||
      !ctx2 ||
      !ctx3 ||
      !ctx4 ||
      !ctx5 ||
      !ctx6 ||
      !ctx7 ||
      !ctx8 ||
      !ctx9
    ) {
      console.log("something is still loading...");
      return;
    }

    console.log("start loop!");

    // loop through canvas' size
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const pixelData1 = ctx1.getImageData(i, j, 1, 1).data;
        const pixelData2 = ctx2.getImageData(i, j, 1, 1).data;
        const pixelData3 = ctx3.getImageData(i, j, 1, 1).data;
        mergeGrayScalesToRGB(i, j, pixelData1, pixelData2, pixelData3);
        pullRGBFromPicsRespectively(i, j, pixelData1, pixelData2, pixelData3);
        mergeGrayScales(i, j, pixelData1, pixelData2, pixelData3);
        mergeRGBValues(i, j, pixelData1, pixelData2, pixelData3);
        // these ones just works on a single image
        shiftRGB(i, j, pixelData1);
        limitRGB(i, j, pixelData3);
      }
    }
  }, [
    image1Loaded,
    image2Loaded,
    image3Loaded,
    ctx1,
    ctx2,
    ctx3,
    ctx4,
    ctx5,
    ctx6,
    ctx7,
    ctx8,
    ctx9,
  ]);

  // if each image is converted to grayscale, then one image's values are used for the red in the final image, another image's grayscale values are used for green, and the last one's values are used for blue, what does the final composite image look like?
  function mergeGrayScalesToRGB(i, j, pixelData1, pixelData2, pixelData3) {
    // image 1 grayscale will fill in all of the red values for the final image
    const pixelGrayScale1 = grayScaleFromPixelData(pixelData1);
    const redValue = pixelGrayScale1;
    // const redValue = 0;

    // image 2 grayscale will fill in the green values for the final image
    const pixelGrayScale2 = grayScaleFromPixelData(pixelData2);
    const greenValue = pixelGrayScale2;
    // const greenValue = 0;

    // image 3 grayscale will fill in the green values for the final image
    const pixelGrayScale3 = grayScaleFromPixelData(pixelData3);
    const blueValue = pixelGrayScale3;
    // const blueValue = 0;

    // draw to canvas 4
    drawPoint(ctx4, i, j, redValue, greenValue, blueValue);
  }

  // for a given pixel, if we pull the blue value from one picture, the green from another, and the red from a third, what does the final composite image look like?
  function pullRGBFromPicsRespectively(
    i,
    j,
    pixelData1,
    pixelData2,
    pixelData3
  ) {
    // grab pixel red value from image 1 pixel red value
    const redValue = pixelData1[0];
    // const redValue = 0;

    // image 2 will fill in the green values for the final image
    const greenValue = pixelData2[1];
    // const greenValue = 0;

    // image 3 will fill in the green values for the final image
    const blueValue = pixelData3[2];
    // const blueValue = 0;

    // draw to canvas 5
    drawPoint(ctx5, i, j, redValue, greenValue, blueValue);
  }

  // for a given pixel, merge the grayscale values from all 3 pictures into one grayscale value. What does the final composite picture look like?
  function mergeGrayScales(i, j, pixelData1, pixelData2, pixelData3) {
    const pixelGrayScale1 = grayScaleFromPixelData(pixelData1);
    const pixelGrayScale2 = grayScaleFromPixelData(pixelData2);
    const pixelGrayScale3 = grayScaleFromPixelData(pixelData3);
    const compositeGrayScale = Math.round(
      (pixelGrayScale1 + pixelGrayScale2 + pixelGrayScale3) / 3
    );

    // draw to canvas 6
    drawPoint(
      ctx6,
      i,
      j,
      compositeGrayScale,
      compositeGrayScale,
      compositeGrayScale
    );
  }

  // for a given pixel, merge the RGB values from all 3 pictures into one RGB value (i.e. average the blue from all 3 pics for a pixel and make the final picture's blue value for the same pixel be that average). What does the final composite picture look like?
  function mergeRGBValues(i, j, pixelData1, pixelData2, pixelData3) {
    const compositeRedValue = Math.round(
      (pixelData1[0] + pixelData2[0] + pixelData3[0]) / 3
    );
    const compositeGreenValue = Math.round(
      (pixelData1[1] + pixelData2[1] + pixelData3[1]) / 3
    );
    const compositeBlueValue = Math.round(
      (pixelData1[2] + pixelData2[2] + pixelData3[2]) / 3
    );

    // draw to canvas 7
    drawPoint(
      ctx7,
      i,
      j,
      compositeRedValue,
      compositeGreenValue,
      compositeBlueValue
    );
  }

  // for just one picture, put the red values in the green slot, the green values in the blue slot, and the blue values in the red slot. How does that change the picture?
  function shiftRGB(i, j, pixelData) {
    const originalRedValue = pixelData[0];
    const originalGreenValue = pixelData[1];
    const originalBlueValue = pixelData[2];

    // draw to canvas 8
    drawPoint(
      ctx8,
      i,
      j,
      // rearranging these in a number of ways yields interesting results!
      originalBlueValue,
      originalRedValue,
      originalGreenValue
    );
  }

  // for a single picture, turn down just the red values by a percentage, or just the blue values by a percentage, etc. How does that affect the final picture?
  function limitRGB(i, j, pixelData) {
    const originalRedValue = pixelData[0];
    const originalGreenValue = pixelData[1];
    const originalBlueValue = pixelData[2];

    // change which color you're limiting and by how much for fun
    const redValue = Math.round(originalRedValue * 0.75);
    const greenValue = Math.round(originalGreenValue * 1);
    const blueValue = Math.round(originalBlueValue * 1);

    // draw to canvas 9
    drawPoint(ctx9, i, j, redValue, greenValue, blueValue);
  }

  // gets the grayscale (average) of RGB values for a given pixel
  function grayScaleFromPixelData(pixelData) {
    const pixelGrayScale = Math.round(
      (pixelData[0] + pixelData[1] + pixelData[2]) / 3
    );
    return pixelGrayScale;
  }

  // helper function to draw a single pixel on a canvas
  function drawPoint(ctx, x, y, redValue, greenValue, blueValue) {
    ctx.fillStyle = `rgb(${redValue}, ${greenValue}, ${blueValue})`;
    ctx.fillRect(x, y, 1, 1);
  }

  return (
    <div className="App">
      <canvas id="c1" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c2" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c3" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c4" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c5" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c6" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c7" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c8" width={canvasWidth} height={canvasHeight}></canvas>
      <canvas id="c9" width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  );
}

export default App;
