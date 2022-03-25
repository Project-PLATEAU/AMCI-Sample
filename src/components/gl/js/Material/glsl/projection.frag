// viewMatrix: ワールド座標から視点座標へ変換
// cameraPosition: カメラの位置

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform vec3 color;
uniform sampler2D tex;
uniform vec3 projPosition;

// varying vec3 vNormal;
varying vec4 vWorldPosition;
varying vec4 vTexCoords;

void main() {
  #include <clipping_planes_fragment>

  vec4 diffuseColor = vec4(diffuse, opacity);
  ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  vec3 totalEmissiveRadiance = emissive;

  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>
  #include <emissivemap_fragment>

  // accumulation
  #include <lights_phong_fragment>
  #include <lights_fragment_begin>
  #include <lights_fragment_maps>
  #include <lights_fragment_end>

  // modulation
  #include <aomap_fragment>

  vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

  #include <envmap_fragment>
  #include <output_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>

  vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;
  vec4 outColor = texture2D(tex, uv);

  // this makes sure we don't render the texture also on the back of the object
  vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
  float dotProduct = dot(vNormal, projectorDirection);
  if (dotProduct < 0.0) {
    outColor = vec4(color, 0.0);
  }

  gl_FragColor = vec4(outColor.rgb * outgoingLight, 1.0);
}
