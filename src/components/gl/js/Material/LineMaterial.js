import vert from './glsl/line.vert'
import frag from './glsl/line.frag'

/**
 * parameters = {
 *  color: <hex>,
 *  linewidth: <float>,
 *  dashed: <boolean>,
 *  dashScale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>,
 *  drawStart: <float>,
 *  drawEnd: <float>,
 *  resolution: <Vector2>, // to be set by renderer
 * }
 */

import {
  ShaderLib,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector2
} from "three";

UniformsLib.line = {
  worldUnits: { value: 1 },
  linewidth: { value: 1 },
  resolution: { value: new Vector2(1, 1) },
  dashScale: { value: 1 },
  dashSize: { value: 1 },
  gapSize: { value: 1 }, // todo FIX - maybe change to totalSize
  drawStart: { value: 1 },
  drawEnd: { value: 1 }
};

ShaderLib['line'] = {
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    UniformsLib.fog,
    UniformsLib.line
  ]),
  vertexShader: vert,
  fragmentShader: frag
};

class LineMaterial extends ShaderMaterial {

  constructor(parameters) {

    super({
      type: 'LineMaterial',
      uniforms: UniformsUtils.clone(ShaderLib['line'].uniforms),
      vertexShader: ShaderLib['line'].vertexShader,
      fragmentShader: ShaderLib['line'].fragmentShader,
      clipping: true // required for clipping support
    });

    Object.defineProperties(this, {

      color: {
        enumerable: true,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(value) {
          this.uniforms.diffuse.value = value;
        }
      },

      worldUnits: {
        enumerable: true,
        get: function() {
          return 'WORLD_UNITS' in this.defines;
        },
        set: function(value) {
          if (value === true) {
            this.defines.WORLD_UNITS = '';
          } else {
            delete this.defines.WORLD_UNITS;
          }
        }
      },

      linewidth: {
        enumerable: true,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(value) {
          this.uniforms.linewidth.value = value;
        }
      },

      dashed: {
        enumerable: true,
        get: function() {
          return Boolean('USE_DASH' in this.defines);
        },
        set(value) {
          if (Boolean(value) !== Boolean('USE_DASH' in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.USE_DASH = '';
          } else {
            delete this.defines.USE_DASH;
          }
        }
      },

      dashScale: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(value) {
          this.uniforms.dashScale.value = value;
        }
      },

      dashSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(value) {
          this.uniforms.dashSize.value = value;
        }
      },

      dashOffset: {
        enumerable: true,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(value) {
          this.uniforms.dashOffset.value = value;
        }
      },

      gapSize: {
        enumerable: true,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(value) {
          this.uniforms.gapSize.value = value;
        }
      },

      opacity: {
        enumerable: true,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(value) {
          this.uniforms.opacity.value = value;
        }
      },

      resolution: {
        enumerable: true,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(value) {
          this.uniforms.resolution.value.copy(value);
        }
      },

      alphaToCoverage: {
        enumerable: true,
        get: function() {
          return Boolean('ALPHA_TO_COVERAGE' in this.defines);
        },
        set: function(value) {
          if (Boolean(value) !== Boolean('ALPHA_TO_COVERAGE' in this.defines)) {
            this.needsUpdate = true;
          }
          if (value === true) {
            this.defines.ALPHA_TO_COVERAGE = '';
            this.extensions.derivatives = true;
          } else {
            delete this.defines.ALPHA_TO_COVERAGE;
            this.extensions.derivatives = false;
          }
        }
      },

      drawStart: {
        enumerable: true,
        get: function() {
          return this.uniforms.drawStart.value;
        },
        set: function(value) {
          this.uniforms.drawStart.value = value;
        }
      },

      drawEnd: {
        enumerable: true,
        get: function() {
          return this.uniforms.drawEnd.value;
        },
        set: function(value) {
          this.uniforms.drawEnd.value = value;
        }
      },

    });

    this.setValues(parameters);

  }

}

LineMaterial.prototype.isLineMaterial = true;

export { LineMaterial };
