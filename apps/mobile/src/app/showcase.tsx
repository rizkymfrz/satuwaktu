import type { JSX } from "react";

const Showcase: () => JSX.Element | null = __DEV__
  ? require("@/dev/showcase-screen").default
  : () => null;

export default Showcase;
