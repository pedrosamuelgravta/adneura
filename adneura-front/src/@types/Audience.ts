import { Demographics } from "./Domographic";
import { Trigger } from "./Trigger";

export interface Audience {
  id?: number;
  name?: string;
  description?: string;
  psycho_graphic?: string;
  attitudinal?: string;
  self_concept?: string;
  triggers?: Trigger[];
  demographics?: Demographics;
  lifestyle?: string;
  media_habits?: string;
  general_keywords?: string;
  brand_keywords?: string;
  image_prompt?: string;
  audience_img?: string;
  key_tags?: string[];
}
