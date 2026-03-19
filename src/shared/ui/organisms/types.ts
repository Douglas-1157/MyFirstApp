import { TextStyle } from "react-native";

export interface CharacterAnimationParams {
  opacity: number;
  translateY: number;
  scale: number;
  rotate: number;
}

export interface AnimationConfig {
  characterDelay: number;
  characterEnterDuration: number;
  characterExitDuration: number;
  layoutTransitionDuration: number;
  maxBlurIntensity?: number;
  spring?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
  };
}

export interface StaggeredTextProps {
  text: string;
  style?: TextStyle;
  animationConfig?: Partial<AnimationConfig>;
  enterFrom?: Partial<CharacterAnimationParams>;
  enterTo?: Partial<CharacterAnimationParams>;
  exitFrom?: Partial<CharacterAnimationParams>;
  exitTo?: Partial<CharacterAnimationParams>;
}

// O segredo está aqui: tiramos o "extends StaggeredTextProps"
export interface CharacterProps {
  char: string;
  index: number;
  totalChars: number;
  style?: TextStyle; // Adicionado aqui individualmente
  animationConfig: AnimationConfig;
  enterFrom: CharacterAnimationParams;
  enterTo: CharacterAnimationParams;
  exitFrom: CharacterAnimationParams;
  exitTo: CharacterAnimationParams;
}