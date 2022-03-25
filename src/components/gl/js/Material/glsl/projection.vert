// modelMatrix: オブジェクト座標からワールド座標へ変換する
// viewMatrix: ワールド座標から視点座標へ変換
// modelViewMatrix: modelMatrixとviewMatrixの積算
// projectionMatrix: カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列
// cameraPosition: カメラの位置
// normalMatrix: 頂点法線ベクトルを視点座標系に変換する行列
// position: 頂点座標
// normal: 頂点法線ベクトル
// uv: テクスチャを貼るためのUV座標

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

uniform mat4 viewMatrixCamera;
uniform mat4 projectionMatrixCamera;
uniform mat4 modelMatrixCamera;

varying vec4 vWorldPosition;
// varying vec3 vNormal;
varying vec4 vTexCoords;
varying vec3 vViewPosition;

void main() {
  #include <uv_vertex>
  #include <uv2_vertex>
  #include <color_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>

  vViewPosition = - mvPosition.xyz;

  #include <worldpos_vertex>
  #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

  // vNormal = mat3(modelMatrix) * normal;
  vWorldPosition = modelMatrix * vec4(position, 1.0);
  vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
