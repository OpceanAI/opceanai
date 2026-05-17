import { Effect } from "postprocessing";
import { CanvasTexture, Color, NearestFilter, RepeatWrapping, Texture, Uniform } from "three";

export interface ASCIIEffectProps {
  characters?: string;
  fontSize?: number;
  cellSize?: number;
  color?: string;
  invert?: boolean;
}

const defaultCharacters = " .'`^\",:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

const fragmentShader = /* glsl */ `
  uniform sampler2D tCharacters;
  uniform float uCellSize;
  uniform float uInvert;
  uniform vec3 uColor;
  uniform vec2 uResolution;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 cell = uResolution / uCellSize;
    vec2 grid = 1.0 / cell;
    vec2 cellUV = grid * (floor(uv / grid) + grid * 0.5);
    vec2 charUV = mod(uv, grid) / grid;

    vec3 sceneColor = texture2D(inputBuffer, cellUV).rgb;
    float brightness = dot(sceneColor, vec3(0.299, 0.587, 0.114));
    brightness = mix(brightness, 1.0 - brightness, uInvert);

    float charCount = 70.0;
    float charIndex = floor(brightness * (charCount - 1.0));
    float charY = floor(charIndex / 10.0);
    float charX = mod(charIndex, 10.0);

    vec2 texCoord = (vec2(charX, 9.0 - charY) + charUV) / 10.0;
    float alpha = texture2D(tCharacters, texCoord).r;

    float finalAlpha = alpha > 0.5 ? 1.0 : 0.0;
    float brightnessFactor = mix(0.3, 1.0, brightness);

    vec3 finalColor = uColor * brightnessFactor;
    outputColor = vec4(finalColor, finalAlpha * 0.85);
  }
`;

export class ASCIIEffect extends Effect {
  private charactersTexture: Texture;

  constructor({
    characters = defaultCharacters,
    fontSize = 60,
    cellSize = 10,
    color = "#2dd4bf",
    invert = false,
  }: ASCIIEffectProps = {}) {
    super("ASCIIEffect", fragmentShader);

    this.charactersTexture = this.createCharactersTexture(characters, fontSize);
    this.uniforms.set("tCharacters", new Uniform(this.charactersTexture));
    this.uniforms.set("uCellSize", new Uniform(cellSize));
    this.uniforms.set("uInvert", new Uniform(invert ? 1.0 : 0.0));
    this.uniforms.set("uColor", new Uniform(new Color(color)));
    this.uniforms.set("uResolution", new Uniform([1.0, 1.0]));
  }

  private createCharactersTexture(characters: string, fontSize: number): Texture {
    const canvas = document.createElement("canvas");
    const cols = 10;
    const rows = 7;
    const cellSize = fontSize * 1.2;
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < characters.length; i++) {
      const x = (i % cols) * cellSize + cellSize / 2;
      const y = Math.floor(i / cols) * cellSize + cellSize / 2;
      ctx.fillText(characters[i], x, y);
    }

    const texture = new CanvasTexture(canvas);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.needsUpdate = true;
    texture.minFilter = NearestFilter;
    texture.magFilter = NearestFilter;

    return texture;
  }

  override setSize(width: number, height: number): void {
    super.setSize(width, height);
    this.uniforms.get("uResolution")!.value = [width, height];
  }
}
