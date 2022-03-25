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

// attribute vec3 offsetPos;
attribute vec3 vertices;
attribute vec3 colors;
attribute float scales;
varying vec3 vViewPosition;
varying vec3 vColor;
varying vec2 vUv;
varying vec4 vMvPosition;
uniform float time;

// float PI = 3.141592653589793;

highp mat2 rotate(float rad){
    return mat2(cos(rad),sin(rad),-sin(rad),cos(rad));
}

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

  vec3 pos = position;
  pos.xz *= rotate(time + vertices.x);
  pos.xy *= rotate(time + vertices.z);
  // vec4 mvPos = modelViewMatrix * vec4(pos * offsetPos, 1.0);

  pos.xyz *= scales;

  vec4 mvPos = modelViewMatrix * vec4(pos + vertices, 1.0);

  #include <worldpos_vertex>
  #include <envmap_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>

  vViewPosition = -mvPos.xyz;
  vColor = colors;
  vUv = uv - 0.5;
  vMvPosition = mvPosition;

  gl_Position = projectionMatrix * mvPos;
}
