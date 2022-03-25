import * as THREE from 'three'
import vert from './glsl/projection.vert'
import frag from './glsl/projection.frag'

export default class ProjectedMaterial extends THREE.ShaderMaterial {

  constructor({camera, texture, color = 0xffffff} = {}) {

    if (!texture || !texture.isTexture) {
      throw new Error('Invalid texture passed to the ProjectedMaterial')
    }
    if (!camera || !camera.isCamera) {
      throw new Error('Invalid camera passed to the ProjectedMaterial')
    }

    // カメラ行列の更新
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    camera.updateWorldMatrix()

    // カメラの行列を取得
    const viewMatrixCamera = camera.matrixWorldInverse.clone()
    const projectionMatrixCamera = camera.projectionMatrix.clone()
    const modelMatrixCamera = camera.matrixWorld.clone()
    const projPosition = camera.position.clone()

    super({
      side: THREE.FrontSide,
      lights: true,
      transparent: false,
      blending: THREE.NormalBlending,
      depthWrite: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.specularmap,
        THREE.UniformsLib.envmap,
        THREE.UniformsLib.aomap,
        THREE.UniformsLib.lightmap,
        THREE.UniformsLib.emissivemap,
        THREE.UniformsLib.bumpmap,
        THREE.UniformsLib.normalmap,
        THREE.UniformsLib.displacementmap,
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights,
        {
          emissive: { value: new THREE.Color( 0x000000 ) },
          specular: { value: new THREE.Color( 0x000000 ) },
          shininess: { value: 0 }
        },
        {
          color: { value: new THREE.Color(color) },
          tex: { value: texture },
          viewMatrixCamera: { type: 'm4', value: viewMatrixCamera },
          projectionMatrixCamera: { type: 'm4', value: projectionMatrixCamera },
          modelMatrixCamera: { type: 'mat4', value: modelMatrixCamera },
          projPosition: { type: 'v3', value: projPosition },
        }
      ]),
      vertexShader: vert,
      fragmentShader: frag
    })

    this.isProjectedMaterial = true
  }

  updateCamera(camera){
    // カメラ行列の更新
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
    camera.updateWorldMatrix()

    // カメラの行列を取得
    const viewMatrixCamera = camera.matrixWorldInverse.clone()
    const projectionMatrixCamera = camera.projectionMatrix.clone()
    const modelMatrixCamera = camera.matrixWorld.clone()
    const projPosition = camera.position.clone()

    this.uniforms.viewMatrixCamera.value = viewMatrixCamera
    this.uniforms.projectionMatrixCamera.value = projectionMatrixCamera
    this.uniforms.modelMatrixCamera.value = modelMatrixCamera
    this.uniforms.projPosition.value = projPosition
  }
}
