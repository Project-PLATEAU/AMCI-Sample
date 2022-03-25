// modelMatrix: オブジェクト座標からワールド座標へ変換する
// viewMatrix: ワールド座標から視点座標へ変換
// modelViewMatrix: modelMatrixとviewMatrixの積算
// projectionMatrix: カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列
// cameraPosition: カメラの位置
// normalMatrix: 頂点法線ベクトルを視点座標系に変換する行列
// position: 頂点座標
// normal: 頂点法線ベクトル
// uv: テクスチャを貼るためのUV座標

attribute vec3 color;

uniform float time;
uniform float size;
uniform sampler2D tex;

varying vec4 vMvPosition;
varying vec3 vColor;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vMvPosition = mvPosition;
  vColor = color;

  gl_PointSize = size * (10.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
