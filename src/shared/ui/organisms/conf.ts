import { AnimationConfig, CharacterAnimationParams } from "./types";

export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  characterDelay: 50,
  characterEnterDuration: 800,
  characterExitDuration: 500,
  layoutTransitionDuration: 500,
  maxBlurIntensity: 12,
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

export const DEFAULT_ENTER_FROM: CharacterAnimationParams = {
  opacity: 0,
  translateY: 20,
  scale: 0.8,
  rotate: -10,
};

export const DEFAULT_ENTER_TO: CharacterAnimationParams = {
  opacity: 1,
  translateY: 0,
  scale: 1,
  rotate: 0,
};

export const DEFAULT_EXIT_FROM: CharacterAnimationParams = {
  opacity: 1,
  translateY: 0,
  scale: 1,
  rotate: 0,
};

export const DEFAULT_EXIT_TO: CharacterAnimationParams = {
  opacity: 0,
  translateY: -20,
  scale: 0.8,
  rotate: 10,
};

export const GRAINY_GRADIENT_SHADER = `
uniform float2 iResolution;
uniform float iTime;
uniform vec4 uColor0;
uniform vec4 uColor1;
uniform vec4 uColor2;
uniform vec4 uColor3;
uniform vec4 uColor4;
uniform float uColorCount;
uniform float uAmplitude;
uniform float uGrainIntensity;
uniform float uGrainSize;
uniform float uGrainEnabled;
uniform float uBrightness;

// Função para gerar o ruído (grain)
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

half4 main(float2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    
    // Movimentação das cores baseada no tempo
    float t = iTime * 0.5;
    
    // Mistura simples de cores baseada na posição UV e tempo
    vec4 color = mix(uColor0, uColor1, sin(uv.x + t) * 0.5 + 0.5);
    color = mix(color, uColor2, cos(uv.y - t) * 0.5 + 0.5);
    color = mix(color, uColor3, sin(uv.x - uv.y + t) * 0.5 + 0.5);
    
    // Adiciona o efeito de grão (Grain)
    if (uGrainEnabled > 0.5) {
        float noise = hash(fragCoord * uGrainSize + iTime);
        color.rgb += (noise - 0.5) * uGrainIntensity;
    }
    
    // Ajuste de brilho
    color.rgb += uBrightness;

    return color;
}
`;