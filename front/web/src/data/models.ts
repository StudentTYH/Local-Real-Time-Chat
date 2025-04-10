export enum ModelId {
  Qwen2 = "Qwen2",
}

export interface Model {
  id: ModelId;
  name: string;
}

export const models: Model[] = [
  {
    id: ModelId.Qwen2,
    name: "Qwen2",
  },
];
