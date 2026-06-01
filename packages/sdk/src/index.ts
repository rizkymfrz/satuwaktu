export { createSatuwaktuClient } from "./client";
export type { SatuwaktuClient, SatuwaktuClientOptions } from "./client";
export { createAuthApi } from "./auth";
export type { LoginInput, RegisterInput } from "./auth";
export { createChapterApi } from "./chapter";
export type { CreateChapterInput, UpdateChapterInput } from "./chapter";
export { createFragmenApi } from "./fragmen";
export type {
  CreateFragmenInput,
  UpdateFragmenInput,
  QueryFragmenInput,
} from "./fragmen";
export { createResonansiApi } from "./resonansi";
export { createTitipanKataApi } from "./titipan-kata";

import { createSatuwaktuClient, type SatuwaktuClientOptions } from "./client";
import { createAuthApi } from "./auth";
import { createChapterApi } from "./chapter";
import { createFragmenApi } from "./fragmen";
import { createResonansiApi } from "./resonansi";
import { createTitipanKataApi } from "./titipan-kata";

export const createApi = (options: SatuwaktuClientOptions) => {
  const client = createSatuwaktuClient(options);
  return {
    auth: createAuthApi(client),
    chapter: createChapterApi(client),
    fragmen: createFragmenApi(client),
    resonansi: createResonansiApi(client),
    titipanKata: createTitipanKataApi(client),
  };
};
