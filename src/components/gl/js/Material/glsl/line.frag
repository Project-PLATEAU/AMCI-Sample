uniform vec3 diffuse;
uniform float opacity;
uniform float linewidth;
uniform float drawStart;
uniform float drawEnd;

// #ifdef USE_DASH

//   uniform float dashSize;
//   uniform float gapSize;

// #endif

varying float vLineDistance;
varying vec4 worldPos;
varying vec3 worldStart;
varying vec3 worldEnd;
varying vec3 vPosition;
varying vec3 modelPos;

#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

varying vec2 vUv;

vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

  float mua;
  float mub;

  vec3 p13 = p1 - p3;
  vec3 p43 = p4 - p3;

  vec3 p21 = p2 - p1;

  float d1343 = dot( p13, p43 );
  float d4321 = dot( p43, p21 );
  float d1321 = dot( p13, p21 );
  float d4343 = dot( p43, p43 );
  float d2121 = dot( p21, p21 );

  float denom = d2121 * d4343 - d4321 * d4321;

  float numer = d1343 * d4321 - d1321 * d4343;

  mua = numer / denom;
  mua = clamp( mua, 0.0, 1.0 );
  mub = ( d1343 + d4321 * ( mua ) ) / d4343;
  mub = clamp( mub, 0.0, 1.0 );

  return vec2( mua, mub );

}

void main() {

  #include <clipping_planes_fragment>

  // #ifdef USE_DASH

  //   if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

  //   if ( mod( vLineDistance, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

  // #endif

  float alpha = opacity;

  // #ifdef WORLD_UNITS

  //   // Find the closest points on the view ray and the line segment
  //   vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
  //   vec3 lineDir = worldEnd - worldStart;
  //   vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

  //   vec3 p1 = worldStart + lineDir * params.x;
  //   vec3 p2 = rayEnd * params.y;
  //   vec3 delta = p1 - p2;
  //   float len = length( delta );
  //   float norm = len / linewidth;

  //   #ifndef USE_DASH

  //     #ifdef ALPHA_TO_COVERAGE

  //       float dnorm = fwidth( norm );
  //       alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

  //     #else

  //       if ( norm > 0.5 ) {

  //         discard;

  //       }

  //     #endif

  //   #endif

  // #else

    // #ifdef ALPHA_TO_COVERAGE

    //   // artifacts appear on some hardware if a derivative is taken within a conditional
    //   float a = vUv.x;
    //   float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
    //   float len2 = a * a + b * b;
    //   float dlen = fwidth( len2 );

    //   if ( abs( vUv.y ) > 1.0 ) {

    //     alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

    //   }

    // #else

      vec3 nDiffuse = diffuse;
      // nDiffuse.r = vUv.x;
      // nDiffuse.g = vUv.y;
      // nDiffuse.b = 0.0;

      // if(abs(vUv.y) > drawStart) discard;
      // if(abs(vPosition.y) > drawStart) discard;
      // if(abs(worldPos.y) > drawStart) discard;

      if(drawStart <= 0.01) discard;
      if(abs(modelPos.y) > drawStart || abs(modelPos.y) < drawEnd) discard;

      if ( abs( vUv.y ) > 1.0 ) {
        float a = vUv.x;
        float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
        float len2 = a * a + b * b;
        if ( len2 > 1.0 ) discard;
      }

    // #endif

  // #endif

  vec4 diffuseColor = vec4( nDiffuse, alpha );

  #include <logdepthbuf_fragment>
  #include <color_fragment>

  gl_FragColor = vec4( diffuseColor.rgb, alpha );

  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>

}
