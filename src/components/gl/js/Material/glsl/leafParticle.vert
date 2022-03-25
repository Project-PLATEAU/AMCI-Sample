// modelMatrix: オブジェクト座標からワールド座標へ変換する
// viewMatrix: ワールド座標から視点座標へ変換
// modelViewMatrix: modelMatrixとviewMatrixの積算
// projectionMatrix: カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列
// cameraPosition: カメラの位置
// normalMatrix: 頂点法線ベクトルを視点座標系に変換する行列
// position: 頂点座標
// normal: 頂点法線ベクトル
// uv: テクスチャを貼るためのUV座標

attribute vec3 offsetPos;
attribute vec3 vertices;
attribute vec3 color;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec4 vMvPosition;
varying vec3 vColor;
uniform float time;

float PI = 3.141592653589793;

highp mat2 rotate(float rad){
    return mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
}

void main() {
  vColor = color;
  vNormal = normal;
  vec3 pos = position;

  float rad = time + length(offsetPos);
  pos.xz *= rotate(rad);
  pos.xy *= rotate(rad);

  vec4 mvPosition = modelViewMatrix * vec4(pos + vertices, 1.0);
  vMvPosition = mvPosition;

  gl_Position = projectionMatrix * mvPosition;
  vViewPosition = -mvPosition.xyz;
}
