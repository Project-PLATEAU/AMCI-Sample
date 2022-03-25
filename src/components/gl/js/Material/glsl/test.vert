// modelMatrix: オブジェクト座標からワールド座標へ変換する
// viewMatrix: ワールド座標から視点座標へ変換
// modelViewMatrix: modelMatrixとviewMatrixの積算
// projectionMatrix: カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列
// cameraPosition: カメラの位置
// normalMatrix: 頂点法線ベクトルを視点座標系に変換する行列
// position: 頂点座標
// normal: 頂点法線ベクトル
// uv: テクスチャを貼るためのUV座標

uniform float time;
uniform float index;
uniform float total;

varying vec3 vPos;
varying vec2 vUv;

void main(){
  vec3 pos = position;
  pos.y *= 1.0 + cos(time) * 0.5 + (index / total);

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vPos = worldPosition.xyz;

  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
