// viewMatrix: ワールド座標から視点座標へ変換
// cameraPosition: カメラの位置

uniform float time;
uniform float size;
uniform sampler2D tex;

varying vec4 vMvPosition;
varying vec3 vColor;

// vec3 hsv2rgb(vec3 c){
//   vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
//   vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
//   return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
// }

void main(){
  float opacity = 5.0 / length(vMvPosition.xyz);
  gl_FragColor = vec4(vColor, opacity) * texture2D(tex, gl_PointCoord);
}
