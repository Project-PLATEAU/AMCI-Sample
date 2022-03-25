import * as THREE from 'three'
import Core from './Core'

export default new (class Scene {
  /**
   * [constructor description]
   * @return {[type]}       [description]
   */
  constructor() {
    this.content = null
    this.subContent = null
    this.currentScene = ''

    this.pos = {
      co2: new THREE.Vector3(-2.56, 6.08, 12.72),
      walks: new THREE.Vector3(-0.643, 17.749, 15.382),
      points: new THREE.Vector3(14.346, 9.956, 6.669),
      venues: new THREE.Vector3(0.0231, 9.774, 15.618),
      sdgs:{
        all: new THREE.Vector3(-2.56, 6.08, 12.72),
        otemachi: new THREE.Vector3(0.778, 8.958, 9.499),
        marunouchi: new THREE.Vector3(0.994, 7.186, 14.112),
        yurakucho: new THREE.Vector3(-1.368, 5.189, 18.099)
      }
    }

    this.tpos = {
      co2: new THREE.Vector3(-3.45, 1.35, 0.2),
      walks: new THREE.Vector3(-4.619, 0.0, 3.118),
      points: new THREE.Vector3(-2.208, 0.0, 5.763),
      venues: new THREE.Vector3(-6.599, 0.0, 3.12),
      sdgs:{
        all: new THREE.Vector3(-3.45, 1.35, 0.2),
        otemachi: new THREE.Vector3(-4.171, 0.000, -3.824),
        marunouchi: new THREE.Vector3(-4.389, 0.000, 1.221),
        yurakucho: new THREE.Vector3(-6.129, 0.000, 5.436)
      }
    }

  }

  // ContentType = 'AreaActivity' | 'Venues' | 'SDGsActions'
  // AreaActivityTab = 'Co2Reducations' | 'Walks' | 'Points'
  // SDGsActionsTab = 'All' | 'Yurakucho' | 'Marunouchi' | 'Otemachi'
  /**
   * [change description]
   * @param  {[type]} contentType [description]
   * @param  {[type]} subParam     [description]
   * @return {[type]}             [description]
   */
  change(contentType, subParam, city) {
    // const beforeContent = this.contentType
    // const beforeSubContent = this.subParam

    console.log('isContentOpen', Core.isContentOpen)
    console.log('contentType:', contentType + ', subParam: ' + subParam)

    switch(this.currentScene){
      case 'Co2Reducations':
        city.closeCo2Reducations()
      break;
      case 'Walks':
        city.closeWalks()
      break;
      case 'Points':
        city.closePoints()
      break;
      case 'Venues':
        city.closeVenues()
      break;
      case 'SDGs':
        city.closeSDGs()
      break;
    }


    if (contentType == null) {

      if (Core.isContentOpen) {
        Core.contentClose()
        Core.contentOpen(Core.cameraPos, Core.targetPos)
        city.ringTexts.toDefault()
        this.currentScene = ''
      }

      city.openDefault()

    } else {

      if (contentType === 'AreaActivity') {
        if (subParam === '' || subParam === 'Co2Reducations') {
          city.openCo2Reducations()
          Core.contentOpen(this.pos.co2, this.tpos.co2)
          this.currentScene = 'Co2Reducations'
        }
        else if(subParam === 'Walks'){
          city.openWalks()
          Core.contentOpen(this.pos.walks, this.tpos.walks)
          this.currentScene = 'Walks'
        }
        else if(subParam === 'Points'){
          city.openPoints()
          Core.contentOpen(this.pos.points, this.tpos.points)
          this.currentScene = 'Points'
        }
      }
      else if(contentType === 'Venues'){
        city.openVenues(subParam)
        this.currentScene = 'Venues'

        // ShopID
        if(subParam === ''){
          Core.contentOpen(this.pos.venues, this.tpos.venues)
        }
      }
      else if(contentType === 'SDGsActions'){
        city.openSDGs(subParam)
        this.currentScene = 'SDGs'

        if(subParam === '' || subParam === 'All'){
          Core.contentOpen(this.pos.sdgs.all, this.tpos.sdgs.all)
        }
        else if(subParam === 'Otemachi'){
          Core.contentOpen(this.pos.sdgs.otemachi, this.tpos.sdgs.otemachi)
        }
        else if(subParam === 'Marunouchi'){
          Core.contentOpen(this.pos.sdgs.marunouchi, this.tpos.sdgs.marunouchi)
        }
        else if(subParam === 'Yurakucho'){
          Core.contentOpen(this.pos.sdgs.yurakucho, this.tpos.sdgs.yurakucho)
        }

      }

      if (!Core.isContentOpen) {
        city.ringTexts.toThin()
      }
    }

    this.content = contentType
    this.subContent = subParam
  }
})()
