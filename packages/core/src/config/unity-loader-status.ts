const LOAD_STATUS = {
  Idle: "Idle",
  Loading: "Loading",
  Loaded: "Loaded",
  Error: "Error",
} as const;

type UnityLoaderStatus = (typeof LOAD_STATUS)[keyof typeof LOAD_STATUS];

export type { UnityLoaderStatus };
export { LOAD_STATUS };
