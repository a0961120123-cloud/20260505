let capture;
let faceMesh;
let predictions = [];

function setup() {
  // 第一步驟產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像內容
  capture = createCapture(VIDEO);
  capture.hide(); // 隱藏原本生成的 HTML5 video 標籤，我們要在畫布上畫出它

  // 初始化 faceMesh 模型 (ml5 v1 新語法)
  faceMesh = ml5.faceMesh(capture, modelReady);
  // 當偵測到臉部特徵點時，更新預測結果
  faceMesh.detectStart(capture, results => {
    predictions = results;
  });
}

function draw() {
  // 畫布的背景顏色為 e7c6ff
  background('#e7c6ff');

  // 在擷取影像畫面的上方顯示文字，左右置中在畫布上
  fill(0); // 設定文字顏色（黑色）
  textSize(windowWidth * 0.025); // 根據視窗大小調整字體，避免過大或過小
  textAlign(CENTER, CENTER);
  text("教科1A陳益宏414730910", width / 2, height * 0.15);

  // 顯示的影像寬高為整個畫布寬高的 50%
  let w = width * 0.5;
  let h = height * 0.5;

  // 左右顛倒並置中顯示影像
  push();
  translate(width / 2, height / 2);
  scale(-1, 1); // 水平翻轉達成左右顛倒
  image(capture, -w / 2, -h / 2, w, h);

  // 繪製臉部辨識線條
  if (predictions.length > 0) {
    let keypoints = predictions[0].keypoints; // ml5 v1 使用 keypoints

    // --- 新增：遮罩功能，將臉部輪廓外填滿 fdf0d5 ---
    let silhouette = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
    
    push();
    fill('#fdf0d5'); // 指定的背景顏色
    noStroke();
    beginShape();
    // 外部邊界：建立一個涵蓋整個影像顯示範圍的矩形
    vertex(-w / 2, -h / 2);
    vertex(w / 2, -h / 2);
    vertex(w / 2, h / 2);
    vertex(-w / 2, h / 2);

    // 內部洞口：使用臉部輪廓點
    beginContour();
    for (let i = 0; i < silhouette.length; i++) {
      let p = keypoints[silhouette[i]];
      let vx = map(p.x, 0, capture.width, -w / 2, w / 2);
      let vy = map(p.y, 0, capture.height, -h / 2, h / 2);
      vertex(vx, vy);
    }
    endContour();
    endShape(CLOSE);
    pop();

    // 指定要串接的點編號
    let indices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    stroke(255, 0, 0); // 嘴唇線條採用紅色
    strokeWeight(1);   // 根據需求將嘴唇粗細改為 1
    noFill();

    for (let i = 0; i < indices.length - 1; i++) {
      let p1 = keypoints[indices[i]];
      let p2 = keypoints[indices[i + 1]];

      if (p1 && p2) {
        // 將原始影像座標映射到畫布中間顯示的影像區域 (ml5 v1 使用 p1.x 和 p1.y)
        let x1 = map(p1.x, 0, capture.width, -w / 2, w / 2);
        let y1 = map(p1.y, 0, capture.height, -h / 2, h / 2);
        let x2 = map(p2.x, 0, capture.width, -w / 2, w / 2);
        let y2 = map(p2.y, 0, capture.height, -h / 2, h / 2);

        line(x1, y1, x2, y2);
      }
    }

    // 繪製眼睛外圈 (黑眼圈效果，深灰色，粗細 15)
    let eyePaths = [
      [130, 247, 30, 29, 27, 28, 56, 190, 243, 112, 26, 22, 23, 24, 110, 25, 130], // 右眼外圈
      [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382, 362]  // 左眼外圈
    ];

    stroke(30); // 深灰色偏黑
    strokeWeight(15); // 線條粗細為 15

    for (let path of eyePaths) {
      for (let i = 0; i < path.length - 1; i++) {
        let p1 = keypoints[path[i]];
        let p2 = keypoints[path[i + 1]];

        if (p1 && p2) {
          let x1 = map(p1.x, 0, capture.width, -w / 2, w / 2);
          let y1 = map(p1.y, 0, capture.height, -h / 2, h / 2);
          let x2 = map(p2.x, 0, capture.width, -w / 2, w / 2);
          let y2 = map(p2.y, 0, capture.height, -h / 2, h / 2);

          line(x1, y1, x2, y2);
        }
      }
    }

    // 繪製整個臉部的最外層輪廓 (螢光藍色，粗細 2) - 直接使用前面定義好的 silhouette
    stroke(0, 255, 255); // 改為明顯的螢光藍色 (Cyan)
    strokeWeight(2);   // 線條粗細設定為 2

    for (let i = 0; i < silhouette.length - 1; i++) {
      let p1 = keypoints[silhouette[i]];
      let p2 = keypoints[silhouette[i + 1]];

      if (p1 && p2) {
        let x1 = map(p1.x, 0, capture.width, -w / 2, w / 2);
        let y1 = map(p1.y, 0, capture.height, -h / 2, h / 2);
        let x2 = map(p2.x, 0, capture.width, -w / 2, w / 2);
        let y2 = map(p2.y, 0, capture.height, -h / 2, h / 2);
        line(x1, y1, x2, y2);
      }
    }
  }
  pop();
}

function modelReady() {
  console.log("FaceMesh Model Ready!");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
