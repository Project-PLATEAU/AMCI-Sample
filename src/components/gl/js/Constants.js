import * as THREE from 'three'

export default {
  combine: {
    'THREE.MultiplyOperation': THREE.MultiplyOperation,
    'THREE.MixOperation': THREE.MixOperation,
    'THREE.AddOperation': THREE.AddOperation
  },
  side: {
    'THREE.FrontSide': THREE.FrontSide,
    'THREE.BackSide': THREE.BackSide,
    'THREE.DoubleSide': THREE.DoubleSide
  },
  blendingMode: {
    'THREE.NoBlending': THREE.NoBlending,
    'THREE.NormalBlending': THREE.NormalBlending,
    'THREE.AdditiveBlending': THREE.AdditiveBlending,
    'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
    'THREE.MultiplyBlending': THREE.MultiplyBlending,
    'THREE.CustomBlending': THREE.CustomBlending
  },
  equations: {
    'THREE.AddEquation': THREE.AddEquation,
    'THREE.SubtractEquation': THREE.SubtractEquation,
    'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation
  },
  destinationFactors: {
    'THREE.ZeroFactor': THREE.ZeroFactor,
    'THREE.OneFactor': THREE.OneFactor,
    'THREE.SrcColorFactor': THREE.SrcColorFactor,
    'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
    'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
    'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
    'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
    'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor
  },
  sourceFactors: {
    'THREE.DstColorFactor': THREE.DstColorFactor,
    'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
    'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor
  }
}
