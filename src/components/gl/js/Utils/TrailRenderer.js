/**
 * @author Mark Kellogg - http://www.github.com/mkkellogg
 */

//= ======================================
// Trail Renderer
//= ======================================

import * as THREE from 'three'

const MAX_HEAD_VERTICES = 128
const LOCAL_ORIENTATION_TANGENT = new THREE.Vector3(1, 0, 0)
// const LOCAL_ORIENTATION_DIRECTION = new THREE.Vector3(0, 0, -1)
const LOCAL_HEAD_ORIGIN = new THREE.Vector3(0, 0, 0)
const POSITION_COMPONENT_COUNT = 3
const UV_COMPONENT_COUNT = 2
const INDICES_PER_FACE = 3
const FACES_PER_QUAD = 2

export default class TrailRenderer extends THREE.Object3D {
  constructor(scene, orientToMovement) {
    super()
    this.active = false

    this.orientToMovement = orientToMovement

    this.scene = scene

    this.geometry = null
    this.mesh = null
    this.nodeCenters = null

    this.lastNodeCenter = null
    this.currentNodeCenter = null
    this.lastOrientationDir = null
    this.nodeIDs = null
    this.currentLength = 0
    this.currentEnd = 0
    this.currentNodeID = 0

    this.Shader = {}

    this.Shader.BaseVertexVars = [
      'attribute float nodeID;',
      'attribute float nodeVertexID;',
      'attribute vec3 nodeCenter;',

      'uniform float minID;',
      'uniform float maxID;',
      'uniform float trailLength;',
      'uniform float maxTrailLength;',
      'uniform float verticesPerNode;',
      'uniform vec2 textureTileFactor;',

      'uniform vec4 headColor;',
      'uniform vec4 tailColor;',

      'varying vec4 vColor;',
    ].join('\n')

    this.Shader.TexturedVertexVars = [
      this.Shader.BaseVertexVars,
      'varying vec2 vUV;',
      'uniform float dragTexture;',
    ].join('\n')

    this.Shader.BaseFragmentVars = ['varying vec4 vColor;', 'uniform sampler2D texture;'].join('\n')

    this.Shader.TexturedFragmentVars = [this.Shader.BaseFragmentVars, 'varying vec2 vUV;'].join('\n')

    this.Shader.VertexShaderCore = [
      'float fraction = ( maxID - nodeID ) / ( maxID - minID );',
      'vColor = ( 1.0 - fraction ) * headColor + fraction * tailColor;',
      'vec4 realPosition = vec4( ( 1.0 - fraction ) * position.xyz + fraction * nodeCenter.xyz, 1.0 ); ',
    ].join('\n')

    this.Shader.BaseVertexShader = [
      this.Shader.BaseVertexVars,

      'void main() { ',

      this.Shader.VertexShaderCore,
      'gl_Position = projectionMatrix * viewMatrix * realPosition;',

      '}',
    ].join('\n')

    this.Shader.BaseFragmentShader = [
      this.Shader.BaseFragmentVars,

      'void main() { ',

      'gl_FragColor = vColor;',

      '}',
    ].join('\n')

    this.Shader.TexturedVertexShader = [
      this.Shader.TexturedVertexVars,

      'void main() { ',

      this.Shader.VertexShaderCore,
      'float s = 0.0;',
      'float t = 0.0;',
      'if ( dragTexture == 1.0 ) { ',
      '   s = fraction *  textureTileFactor.s; ',
      ' 	t = ( nodeVertexID / verticesPerNode ) * textureTileFactor.t;',
      '} else { ',
      '	s = nodeID / maxTrailLength * textureTileFactor.s;',
      ' 	t = ( nodeVertexID / verticesPerNode ) * textureTileFactor.t;',
      '}',
      'vUV = vec2( s, t ); ',
      'gl_Position = projectionMatrix * viewMatrix * realPosition;',

      '}',
    ].join('\n')

    this.Shader.TexturedFragmentShader = [
      this.Shader.TexturedFragmentVars,

      'void main() { ',

      'vec4 textureColor = texture2D( texture, vUV );',
      'gl_FragColor = vColor * textureColor;',

      '}',
    ].join('\n')

    // advance
    // this.orientationTangent = new THREE.Vector3()
    // this.position = new THREE.Vector3()
    // this.offset = new THREE.Vector3()

    this.tempMatrix4 = new THREE.Matrix4()
    this.tempMatrix3 = new THREE.Matrix3()
    this.tempQuaternion = new THREE.Quaternion()
    this.tempPosition = new THREE.Vector3()
    this.tempOffset = new THREE.Vector3()
    this.worldOrientation = new THREE.Vector3()
    this.tempDirection = new THREE.Vector3()
    this.tempLocalHeadGeometry = []

    for (let i = 0; i < MAX_HEAD_VERTICES; i++) {
      const vertex = new THREE.Vector3()
      this.tempLocalHeadGeometry.push(vertex)
    }
  }

  createMaterial(vertexShader, fragmentShader, customUniforms) {
    customUniforms = customUniforms || {}

    customUniforms.trailLength = { type: 'f', value: null }
    customUniforms.verticesPerNode = { type: 'f', value: null }
    customUniforms.minID = { type: 'f', value: null }
    customUniforms.maxID = { type: 'f', value: null }
    customUniforms.dragTexture = { type: 'f', value: null }
    customUniforms.maxTrailLength = { type: 'f', value: null }
    customUniforms.textureTileFactor = { type: 'v2', value: null }

    customUniforms.headColor = { type: 'v4', value: new THREE.Vector4() }
    customUniforms.tailColor = { type: 'v4', value: new THREE.Vector4() }

    vertexShader = vertexShader || this.Shader.BaseVertexShader
    fragmentShader = fragmentShader || this.Shader.BaseFragmentShader

    const material = new THREE.ShaderMaterial({
      uniforms: customUniforms,
      vertexShader,
      fragmentShader,

      transparent: true,
      alphaTest: 0.5,

      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendEquation: THREE.AddEquation,

      depthTest: true,
      depthWrite: false,

      side: THREE.DoubleSide,
    })

    return material
  }

  createBaseMaterial(customUniforms) {
    return this.createMaterial(this.Shader.BaseVertexShader, this.Shader.BaseFragmentShader, customUniforms)
  }

  createTexturedMaterial(customUniforms) {
    customUniforms = {}
    customUniforms.texture = { type: 't', value: null }

    return this.createMaterial(this.Shader.TexturedVertexShader, this.Shader.TexturedFragmentShader, customUniforms)
  }

  initialize(material, length, dragTexture, localHeadWidth, localHeadGeometry, targetObject) {
    this.deactivate()
    this.destroyMesh()

    this.length = length > 0 ? length + 1 : 0
    this.dragTexture = !dragTexture ? 0 : 1
    this.targetObject = targetObject

    this.initializeLocalHeadGeometry(localHeadWidth, localHeadGeometry)

    this.nodeIDs = []
    this.nodeCenters = []

    for (let i = 0; i < this.length; i++) {
      this.nodeIDs[i] = -1
      this.nodeCenters[i] = new THREE.Vector3()
    }

    this.material = material

    this.initializeGeometry()
    this.initializeMesh()

    this.material.uniforms.trailLength.value = 0
    this.material.uniforms.minID.value = 0
    this.material.uniforms.maxID.value = 0
    this.material.uniforms.dragTexture.value = this.dragTexture
    this.material.uniforms.maxTrailLength.value = this.length
    this.material.uniforms.verticesPerNode.value = this.VerticesPerNode
    this.material.uniforms.textureTileFactor.value = new THREE.Vector2(1.0, 1.0)

    this.reset()
  }

  initializeLocalHeadGeometry(localHeadWidth, localHeadGeometry) {
    this.localHeadGeometry = []

    if (!localHeadGeometry) {
      let halfWidth = localHeadWidth || 1.0
      halfWidth = halfWidth / 2.0

      this.localHeadGeometry.push(new THREE.Vector3(-halfWidth, 0, 0))
      this.localHeadGeometry.push(new THREE.Vector3(halfWidth, 0, 0))

      this.VerticesPerNode = 2
    } else {
      this.VerticesPerNode = 0
      for (let i = 0; i < localHeadGeometry.length && i < MAX_HEAD_VERTICES; i++) {
        const vertex = localHeadGeometry[i]

        if (vertex && vertex instanceof THREE.Vector3) {
          const vertexCopy = new THREE.Vector3()

          vertexCopy.copy(vertex)

          this.localHeadGeometry.push(vertexCopy)
          this.VerticesPerNode++
        }
      }
    }

    this.FacesPerNode = (this.VerticesPerNode - 1) * 2
    this.FaceIndicesPerNode = this.FacesPerNode * 3
  }

  initializeGeometry() {
    this.vertexCount = this.length * this.VerticesPerNode
    this.faceCount = this.length * this.FacesPerNode

    const geometry = new THREE.BufferGeometry()

    const nodeIDs = new Float32Array(this.vertexCount)
    const nodeVertexIDs = new Float32Array(this.vertexCount * this.VerticesPerNode)
    const positions = new Float32Array(this.vertexCount * POSITION_COMPONENT_COUNT)
    const nodeCenters = new Float32Array(this.vertexCount * POSITION_COMPONENT_COUNT)
    const uvs = new Float32Array(this.vertexCount * UV_COMPONENT_COUNT)
    const indices = new Uint32Array(this.faceCount * INDICES_PER_FACE)

    const nodeIDAttribute = new THREE.BufferAttribute(nodeIDs, 1)
    nodeIDAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('nodeID', nodeIDAttribute)

    const nodeVertexIDAttribute = new THREE.BufferAttribute(nodeVertexIDs, 1)
    nodeVertexIDAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('nodeVertexID', nodeVertexIDAttribute)

    const nodeCenterAttribute = new THREE.BufferAttribute(nodeCenters, POSITION_COMPONENT_COUNT)
    nodeCenterAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('nodeCenter', nodeCenterAttribute)

    const positionAttribute = new THREE.BufferAttribute(positions, POSITION_COMPONENT_COUNT)
    positionAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('position', positionAttribute)

    const uvAttribute = new THREE.BufferAttribute(uvs, UV_COMPONENT_COUNT)
    uvAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setAttribute('uv', uvAttribute)

    const indexAttribute = new THREE.BufferAttribute(indices, 1)
    indexAttribute.setUsage(THREE.DynamicDrawUsage)
    geometry.setIndex(indexAttribute)

    this.geometry = geometry
  }

  zeroVertices() {
    const positions = this.geometry.getAttribute('position')

    for (let i = 0; i < this.vertexCount; i++) {
      const index = i * 3

      positions.array[index] = 0
      positions.array[index + 1] = 0
      positions.array[index + 2] = 0
    }

    positions.needsUpdate = true
    positions.updateRange.count = -1
  }

  zeroIndices() {
    const indices = this.geometry.getIndex()

    for (let i = 0; i < this.faceCount; i++) {
      const index = i * 3

      indices.array[index] = 0
      indices.array[index + 1] = 0
      indices.array[index + 2] = 0
    }

    indices.needsUpdate = true
    indices.updateRange.count = -1
  }

  formInitialFaces() {
    this.zeroIndices()

    const indices = this.geometry.getIndex()

    for (let i = 0; i < this.length - 1; i++) {
      this.connectNodes(i, i + 1)
    }

    indices.needsUpdate = true
    indices.updateRange.count = -1
  }

  initializeMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.dynamic = true
    this.mesh.matrixAutoUpdate = false
    this.mesh.name = 'Trail'
  }

  destroyMesh() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      this.mesh = null
    }
  }

  reset() {
    this.currentLength = 0
    this.currentEnd = -1

    this.lastNodeCenter = null
    this.currentNodeCenter = null
    this.lastOrientationDir = null

    this.currentNodeID = 0

    this.formInitialFaces()
    this.zeroVertices()

    this.geometry.setDrawRange(0, 0)
  }

  updateUniforms() {
    if (this.currentLength < this.length) {
      this.material.uniforms.minID.value = 0
    } else {
      this.material.uniforms.minID.value = this.currentNodeID - this.length
    }

    this.material.uniforms.maxID.value = this.currentNodeID
    this.material.uniforms.trailLength.value = this.currentLength
    this.material.uniforms.maxTrailLength.value = this.length
    this.material.uniforms.verticesPerNode.value = this.VerticesPerNode
  }

  advance() {
    this.targetObject.updateMatrixWorld()
    this.tempMatrix4.copy(this.targetObject.matrixWorld)
    this.advanceWithTransform(this.tempMatrix4)
    this.updateUniforms()
    this.geometry.computeBoundingSphere()
  }

  advanceWithPositionAndOrientation(nextPosition, orientationTangent) {
    this.advanceGeometry({ position: nextPosition, tangent: orientationTangent }, null)
  }

  advanceWithTransform(transformMatrix) {
    this.advanceGeometry(null, transformMatrix)
  }

  advanceGeometry(positionAndOrientation, transformMatrix) {
    // const direction = new THREE.Vector3()
    // const tempPosition = new THREE.Vector3()

    const nextIndex = this.currentEnd + 1 >= this.length ? 0 : this.currentEnd + 1

    if (transformMatrix) {
      this.updateNodePositionsFromTransformMatrix(nextIndex, transformMatrix)
    } else {
      this.updateNodePositionsFromOrientationTangent(
        nextIndex,
        positionAndOrientation.position,
        positionAndOrientation.tangent
      )
    }

    if (this.currentLength >= 1) {
      this.connectNodes(this.currentEnd, nextIndex)

      if (this.currentLength >= this.length) {
        const disconnectIndex = this.currentEnd + 1 >= this.length ? 0 : this.currentEnd + 1
        this.disconnectNodes(disconnectIndex)
      }
    }

    if (this.currentLength < this.length) {
      this.currentLength++
    }

    this.currentEnd++
    if (this.currentEnd >= this.length) {
      this.currentEnd = 0
    }

    if (this.currentLength >= 1) {
      if (this.currentLength < this.length) {
        this.geometry.setDrawRange(0, (this.currentLength - 1) * this.FaceIndicesPerNode)
      } else {
        this.geometry.setDrawRange(0, this.currentLength * this.FaceIndicesPerNode)
      }
    }

    this.updateNodeID(this.currentEnd, this.currentNodeID)
    this.currentNodeID++
  }

  updateHead() {
    if (this.currentEnd < 0) return
    this.targetObject.updateMatrixWorld()
    this.head.tempMatrix4.copy(this.targetObject.matrixWorld)
    this.updateNodePositionsFromTransformMatrix(this.currentEnd, this.head.tempMatrix4)
  }

  updateNodeID(nodeIndex, id) {
    this.nodeIDs[nodeIndex] = id

    const nodeIDs = this.geometry.getAttribute('nodeID')
    const nodeVertexIDs = this.geometry.getAttribute('nodeVertexID')

    for (let i = 0; i < this.VerticesPerNode; i++) {
      const baseIndex = nodeIndex * this.VerticesPerNode + i
      nodeIDs.array[baseIndex] = id
      nodeVertexIDs.array[baseIndex] = i
    }

    nodeIDs.needsUpdate = true
    nodeVertexIDs.needsUpdate = true

    nodeIDs.updateRange.offset = nodeIndex * this.VerticesPerNode
    nodeIDs.updateRange.count = this.VerticesPerNode

    nodeVertexIDs.updateRange.offset = nodeIndex * this.VerticesPerNode
    nodeVertexIDs.updateRange.count = this.VerticesPerNode
  }

  updateNodeCenter(nodeIndex, nodeCenter) {
    this.lastNodeCenter = this.currentNodeCenter

    this.currentNodeCenter = this.nodeCenters[nodeIndex]
    this.currentNodeCenter.copy(nodeCenter)

    const nodeCenters = this.geometry.getAttribute('nodeCenter')

    for (let i = 0; i < this.VerticesPerNode; i++) {
      const baseIndex = (nodeIndex * this.VerticesPerNode + i) * 3
      nodeCenters.array[baseIndex] = nodeCenter.x
      nodeCenters.array[baseIndex + 1] = nodeCenter.y
      nodeCenters.array[baseIndex + 2] = nodeCenter.z
    }

    nodeCenters.needsUpdate = true

    nodeCenters.updateRange.offset = nodeIndex * this.VerticesPerNode * POSITION_COMPONENT_COUNT
    nodeCenters.updateRange.count = this.VerticesPerNode * POSITION_COMPONENT_COUNT
  }

  updateNodePositionsFromOrientationTangent(nodeIndex, nodeCenter, orientationTangent) {
    const positions = this.geometry.getAttribute('position')

    this.updateNodeCenter(nodeIndex, nodeCenter)

    this.tempOffset.copy(nodeCenter)
    this.tempOffset.sub(LOCAL_HEAD_ORIGIN)
    this.tempQuaternion.setFromUnitVectors(LOCAL_ORIENTATION_TANGENT, orientationTangent)

    for (let i = 0; i < this.localHeadGeometry.length; i++) {
      const vertex = this.tempLocalHeadGeometry[i]
      vertex.copy(this.localHeadGeometry[i])
      vertex.applyQuaternion(this.tempQuaternion)
      vertex.add(this.tempOffset)
    }

    for (let i = 0; i < this.localHeadGeometry.length; i++) {
      const positionIndex = (this.VerticesPerNode * nodeIndex + i) * POSITION_COMPONENT_COUNT
      const transformedHeadVertex = this.tempLocalHeadGeometry[i]

      positions.array[positionIndex] = transformedHeadVertex.x
      positions.array[positionIndex + 1] = transformedHeadVertex.y
      positions.array[positionIndex + 2] = transformedHeadVertex.z
    }

    positions.needsUpdate = true
  }

  getMatrix3FromMatrix4(matrix3, matrix4) {
    const e = matrix4.elements
    matrix3.set(e[0], e[1], e[2], e[4], e[5], e[6], e[8], e[9], e[10])
  }

  updateNodePositionsFromTransformMatrix(nodeIndex, transformMatrix) {
    const positions = this.geometry.getAttribute('position')

    this.tempPosition.set(0, 0, 0)
    this.tempPosition.applyMatrix4(transformMatrix)
    this.updateNodeCenter(nodeIndex, this.tempPosition)

    for (let i = 0; i < this.localHeadGeometry.length; i++) {
      const vertex = this.tempLocalHeadGeometry[i]
      vertex.copy(this.localHeadGeometry[i])
    }

    for (let i = 0; i < this.localHeadGeometry.length; i++) {
      const vertex = this.tempLocalHeadGeometry[i]
      vertex.applyMatrix4(transformMatrix)
    }

    if (this.lastNodeCenter && this.orientToMovement) {
      this.getMatrix3FromMatrix4(this.tempMatrix3, transformMatrix)
      this.worldOrientation.set(0, 0, -1)
      this.worldOrientation.applyMatrix3(this.tempMatrix3)

      this.tempDirection.copy(this.currentNodeCenter)
      this.tempDirection.sub(this.lastNodeCenter)
      this.tempDirection.normalize()

      if (this.tempDirection.lengthSq() <= 0.0001 && this.lastOrientationDir) {
        this.tempDirection.copy(this.lastOrientationDir)
      }

      if (this.tempDirection.lengthSq() > 0.0001) {
        if (!this.lastOrientationDir) this.lastOrientationDir = new THREE.Vector3()

        this.tempQuaternion.setFromUnitVectors(this.worldOrientation, this.tempDirection)

        this.tempOffset.copy(this.currentNodeCenter)

        for (let i = 0; i < this.localHeadGeometry.length; i++) {
          const vertex = this.tempLocalHeadGeometry[i]
          vertex.sub(this.tempOffset)
          vertex.applyQuaternion(this.tempQuaternion)
          vertex.add(this.tempOffset)
        }
      }
    }

    for (let i = 0; i < this.localHeadGeometry.length; i++) {
      const positionIndex = (this.VerticesPerNode * nodeIndex + i) * POSITION_COMPONENT_COUNT
      const transformedHeadVertex = this.tempLocalHeadGeometry[i]

      positions.array[positionIndex] = transformedHeadVertex.x
      positions.array[positionIndex + 1] = transformedHeadVertex.y
      positions.array[positionIndex + 2] = transformedHeadVertex.z
    }

    positions.needsUpdate = true

    positions.updateRange.offset = nodeIndex * this.VerticesPerNode * POSITION_COMPONENT_COUNT
    positions.updateRange.count = this.VerticesPerNode * POSITION_COMPONENT_COUNT
  }

  connectNodes(srcNodeIndex, destNodeIndex) {
    const returnObj = {
      attribute: null,
      offset: 0,
      count: -1,
    }
    const indices = this.geometry.getIndex()

    for (let i = 0; i < this.localHeadGeometry.length - 1; i++) {
      const srcVertexIndex = this.VerticesPerNode * srcNodeIndex + i
      const destVertexIndex = this.VerticesPerNode * destNodeIndex + i

      const faceIndex = (srcNodeIndex * this.FacesPerNode + i * FACES_PER_QUAD) * INDICES_PER_FACE

      indices.array[faceIndex] = srcVertexIndex
      indices.array[faceIndex + 1] = destVertexIndex
      indices.array[faceIndex + 2] = srcVertexIndex + 1

      indices.array[faceIndex + 3] = destVertexIndex
      indices.array[faceIndex + 4] = destVertexIndex + 1
      indices.array[faceIndex + 5] = srcVertexIndex + 1
    }

    indices.needsUpdate = true
    indices.updateRange.count = -1

    returnObj.attribute = indices
    returnObj.offset = srcNodeIndex * this.FacesPerNode * INDICES_PER_FACE
    returnObj.count = this.FacesPerNode * INDICES_PER_FACE

    return returnObj
  }

  disconnectNodes(srcNodeIndex) {
    const returnObj = {
      attribute: null,
      offset: 0,
      count: -1,
    }
    const indices = this.geometry.getIndex()

    for (let i = 0; i < this.localHeadGeometry.length - 1; i++) {
      // const srcVertexIndex = this.VerticesPerNode * srcNodeIndex + i

      const faceIndex = (srcNodeIndex * this.FacesPerNode + i * FACES_PER_QUAD) * INDICES_PER_FACE

      indices.array[faceIndex] = 0
      indices.array[faceIndex + 1] = 0
      indices.array[faceIndex + 2] = 0

      indices.array[faceIndex + 3] = 0
      indices.array[faceIndex + 4] = 0
      indices.array[faceIndex + 5] = 0
    }

    indices.needsUpdate = true
    indices.updateRange.count = -1

    returnObj.attribute = indices
    returnObj.offset = srcNodeIndex * this.FacesPerNode * INDICES_PER_FACE
    returnObj.count = this.FacesPerNode * INDICES_PER_FACE

    return returnObj
  }

  deactivate() {
    if (this.isActive) {
      this.scene.remove(this.mesh)
      this.isActive = false
    }
  }

  activate() {
    if (!this.isActive) {
      this.scene.add(this.mesh)
      this.isActive = true
    }
  }
}
