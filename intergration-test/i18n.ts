import i18next from "i18next";
import en from "./locales/en/common.json";
import cn from "./locales/cn/common.json";
import tw from "./locales/tw/common.json";

export const defaultNS = "common";

i18next.init({
  debug: false,
  fallbackLng: "en",
  defaultNS,
  resources: {
    en:{common:en},
    cn:{common:cn},
    tw:{common:tw},
  },
});

export default i18next;
