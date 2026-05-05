let capture;

function setup() {
  // 第一步驟產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像內容
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏原本生成的 HTML5 video 標籤，我們要在畫布上畫出它
}

function draw() {
  // 畫布的背景顏色為 e7c6ff
  background('#e7c6ff');

  // 顯示的影像寬高為整個畫布寬高的 50%
  let w = width * 0.5;
  let h = height * 0.5;

  // 左右顛倒並置中顯示影像
  push();
  translate(width / 2, height / 2);
  scale(-1, 1); // 水平翻轉達成左右顛倒
  image(capture, -w / 2, -h / 2, w, h);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
