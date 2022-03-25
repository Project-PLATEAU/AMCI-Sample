import * as THREE from 'three'

export default class ProjectedMaterial extends THREE.ShaderMaterial {

  constructor({ camera, texture, color = 0xffffff } = {}) {

    if (!texture || !texture.isTexture) {
      throw new Error('Invalid texture passed to the ProjectedMaterial')
    }
    if (!camera || !camera.isCamera) {
      throw new Error('Invalid camera passed to the ProjectedMaterial')
    }

    // make sure the camera matrices are updated
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    camera.updateWorldMatrix()

    // get the matrices from the camera so they're fixed in camera's original position
    const viewMatrixCamera = camera.matrixWorldInverse.clone()
    const projectionMatrixCamera = camera.projectionMatrix.clone()
    const modelMatrixCamera = camera.matrixWorld.clone()
    const projPosition = camera.position.clone()

    super({
      uniforms: {
        color: { value: new THREE.Color(color) },
        tex: { value: texture },
        viewMatrixCamera: { type: 'm4', value: viewMatrixCamera },
        projectionMatrixCamera: { type: 'm4', value: projectionMatrixCamera },
        modelMatrixCamera: { type: 'mat4', value: modelMatrixCamera },
        projPosition: { type: 'v3', value: projPosition },
      },

      vertexShader: `
          uniform mat4 viewMatrixCamera;
          uniform mat4 projectionMatrixCamera;
          uniform mat4 modelMatrixCamera;

          varying vec4 vWorldPosition;
          varying vec3 vNormal;
          varying vec4 vTexCoords;

          void main() {
            vNormal = mat3(modelMatrix) * normal;
            vWorldPosition = modelMatrix * vec4(position, 1.0);
            vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,

      fragmentShader: `
        uniform vec3 color;
        uniform sampler2D tex;
        uniform vec3 projPosition;

        varying vec3 vNormal;
        varying vec4 vWorldPosition;
        varying vec4 vTexCoords;

        void main() {
          vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

          vec4 outColor = texture2D(tex, uv);

          // this makes sure we don't render the texture also on the back of the object
          vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
          float dotProduct = dot(vNormal, projectorDirection);
          if (dotProduct < 0.0) {
            outColor = vec4(color, 1.0);
          }

          gl_FragColor = outColor;
        }
      `,
    })

    this.isProjectedMaterial = true
  }
}
