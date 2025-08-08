import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
	lng: "zh",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	backend: {
		loadPath: "/locales/{{lng}}/translation.json",
	},
})

export default i18n
