export enum VoiceId {
  woman = "woman",
  man = "man",
  A13 = "A13",
  A19 = "A19",
  B15 = "B15",
  B33 = "B33",
}

export interface Voice {
  id: VoiceId;
  name: string;
}

export const voices: Voice[] = [
  {
    id: VoiceId.woman,
    name: "woman",
  },
  {
    id: VoiceId.man,
    name: "man",
  },
  {
    id: VoiceId.A13,
    name: "A13",
  },
  {
    id: VoiceId.A19,
    name: "A19",
  },
  {
    id: VoiceId.B15,
    name: "B15",
  },
  {
    id: VoiceId.B33,
    name: "B33",
  },
];
