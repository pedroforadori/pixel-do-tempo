// sharp 0.35 doesn't include a "types" field in its package.json exports map,
// so moduleResolution:bundler can't find the types automatically.
// This ambient declaration covers the subset of the API used in this project.
declare module "sharp" {
  interface ResizeOptions {
    width?: number;
    height?: number;
    fit?: "cover" | "contain" | "fill" | "inside" | "outside";
    withoutEnlargement?: boolean;
    withoutReduction?: boolean;
  }

  interface Metadata {
    width?: number;
    height?: number;
    format?: string;
    size?: number;
    channels?: number;
    hasAlpha?: boolean;
  }

  interface Sharp {
    metadata(): Promise<Metadata>;
    resize(options?: ResizeOptions): Sharp;
    toBuffer(): Promise<Buffer>;
  }

  function sharp(input: string | Buffer | Uint8Array): Sharp;
  export = sharp;
}
