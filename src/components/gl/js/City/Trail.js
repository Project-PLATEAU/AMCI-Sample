import * as THREE from 'three'
import TrailRenderer from '../Utils/TrailRenderer'
import TrailPoints from '../Data/TrailPoints.json'
import Core from '../Core'
import Loader from '../Loader'
import Data from '~/assets/data/data.json'

export default class Trail {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.intervalTime = 1000
    // this.limit = 50
    this.points = []
    this.splinePoints = []
    this.currSplinePer = 0

    this.setup()
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    // walk data
    const now = Data.totalWalks
    const walkMin = 80000000
    const walkMax = 250000000
    const per = (now - walkMin) / (walkMax - walkMin)
    console.log('walk per:', per)

    // set trail head
    const trailHeadGeometry = []
    const segmentLen = 12
    for (let i = 0; i <= segmentLen; i++) {
      const rad = (i / segmentLen) * Math.PI * 2
      const x = Math.sin(rad) * 0.2
      const z = -Math.cos(rad) * 0.2
      // console.log(rad, x, 0, z)
      trailHeadGeometry.push(new THREE.Vector3(x, 0.0, z))
    }

    const trail = new TrailRenderer(Core.scene, false)

    this.trailMaterial = trail.createBaseMaterial()

    this.trailTarget = this.initTrailTarget()
    trail.initialize(this.trailMaterial, Math.floor(300 * per), false, 0, trailHeadGeometry, this.trailTarget)
    this.trailMaterial.uniforms.headColor.value.set(1.0, 0.0, 0.0, 0.75)
    this.trailMaterial.uniforms.tailColor.value.set(1.0, 0.9, 0.3, 0.5)

    this.t = 0
    this.trail = trail
    this.trailHeadGeometry = trailHeadGeometry

    this.move = new THREE.Vector3()

    for(let i = 0; i < TrailPoints.length; i++){
      this.points.push(new THREE.Vector3(TrailPoints[i].x, TrailPoints[i].y, TrailPoints[i].z))
    }
    this.points.push(this.points[0])

    this.splinePoints = this.createCurvePoints(this.points)

    // points debug
    if(Core.debug){
      this.lineGeometry = new THREE.BufferGeometry()
      this.lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000, lineWidth: 3.0})
      this.splineObject = new THREE.Line(this.lineGeometry, this.lineMaterial)
      Core.scene.add(this.splineObject)
      this.lineGeometry.setFromPoints(this.splinePoints)

      const option = {
        font: Loader.getAsset('helvetica'),
        size: 0.3,
        height: 0.01,
        curveSegments: 1,
        bevelEnabled: false,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0
      }

      for(let i = 0; i < TrailPoints.length; i++){
        const geo = new THREE.SphereGeometry(0.1, 8, 8)
        const mat = new THREE.MeshNormalMaterial({color: 0x00ff00})
        const mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(TrailPoints[i].x, TrailPoints[i].y, TrailPoints[i].z)
        Core.scene.add(mesh)

        const textGeo = new THREE.TextGeometry(String(i), option)
        const textMesh = new THREE.Mesh(textGeo, mat)
        textMesh.position.set(TrailPoints[i].x, TrailPoints[i].y + 0.5, TrailPoints[i].z)
        Core.scene.add(textMesh)
      }
    }


    setInterval(() => {

      // if(this.points.length > this.limit){
      //   this.points.shift()
      // }
      // this.points.push(this.createPoint())
      // this.splinePoints = this.createCurvePoints(this.points)
      // this.lineGeometry.setFromPoints(this.splinePoints)

      this.interval()
    }, this.intervalTime)
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {}

  /**
   * [show description]
   * @return {[type]} [description]
   */
  show() {
    this.trail.activate()
  }

  /**
   * [hide description]
   * @return {[type]} [description]
   */
  hide() {
    this.trail.deactivate()
  }

  /**
   * [initTrailTarget description]
   * @return {[type]} [description]
   */
  initTrailTarget() {
    const obj = new THREE.Object3D()
    obj.name = 'Trail'
    obj.position.set(0, 1, 0)
    Core.scene.add(obj)
    return obj
  }

  /**
   * [createPoint description]
   * @return {[type]} [description]
   */
  // createPoint(){
  //   let radiusx = 10
  //   let radiusy = 0
  //   let radiusz = 16
  //   const x = Math.random() * radiusx - (radiusx / 2)
  //   const y = Math.random() * radiusy + 0.2
  //   const z = Math.random() * radiusz - (radiusz / 2)
  //   return new THREE.Vector3(x, y, z)
  // }

  /**
   * [createCurvePoints description]
   * @param  {[type]} points [description]
   * @return {[type]}        [description]
   */
  createCurvePoints(points){
    const curve = new THREE.CatmullRomCurve3(points)
    // const curve = new THREE.SplineCurve(points)
    const sPoints = curve.getPoints(TrailPoints.length * 12)
    const nPoints = []
    for(let i = 0; i < sPoints.length; i++){
      const p = sPoints[i]
      const np = new THREE.Vector3()
      np.x = p.x
      np.y = p.y
      np.z = p.z
      nPoints.push(np)
    }
    return nPoints
  }

  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
    this.trail.advance()

    // this.t += 0.02
    // this.trailTarget.position.x = 5 * Math.cos(this.t)
    // this.trailTarget.position.z = 5 * Math.sin(this.t)

    const index = Math.floor(this.currSplinePer * this.splinePoints.length)
    // console.log(index)

    if(this.splinePoints[index]){
      // this.trailTarget.position.x = this.splinePoints[index].x
      // this.trailTarget.position.y = this.splinePoints[index].y
      // this.trailTarget.position.z = this.splinePoints[index].z
      this.trailTarget.position.x += (this.splinePoints[index].x - this.trailTarget.position.x) * 0.3
      this.trailTarget.position.y += (this.splinePoints[index].y - this.trailTarget.position.y) * 0.3
      this.trailTarget.position.z += (this.splinePoints[index].z - this.trailTarget.position.z) * 0.3
    }


    this.currSplinePer += 0.001
    if(this.currSplinePer > 1.0){
      this.currSplinePer = 0
    }
  }

  /**
   * [interval description]
   * @return {[type]} [description]
   */
  interval(){
    // const before = this.move
    // this.move.x = Math.random() * (this.radius * 2) - this.radius
    // this.move.y = Math.random() * 2 + 0.5
    // this.move.z = Math.random() * (this.radius * 2) - this.radius
    // console.log(this.move)
  }
}
