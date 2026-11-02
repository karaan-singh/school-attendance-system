export interface TempleNightRendererInstance {
  render: (now: number) => void;
  resize: () => void;
  reducedMotion: boolean;
  setPointer: (x: number, y: number, inside?: boolean) => void;
  dispose: () => void;
}

export function createTempleNightRenderer(
  canvas: HTMLCanvasElement
): TempleNightRendererInstance;
