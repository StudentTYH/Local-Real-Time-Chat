export enum VoiceId {
  woman = "181",
  man = "2",
  A13 = "3",
  A19 = "4",
  B15 = "5",
  B33 = "6",
}

export interface Voice {
  id: VoiceId;
  name: string;
}

export const voices: Voice[] = [
  {
    id: VoiceId.woman,
    name: "181",
  },
  {
    id: VoiceId.man,
    name: "2",
  },
  {
    id: VoiceId.A13,
    name: "3",
  },
  {
    id: VoiceId.A19,
    name: "4",
  },
  {
    id: VoiceId.B15,
    name: "5",
  },
  {
    id: VoiceId.B33,
    name: "6",
  },
];
