import translationEN from '../../../static/locales/en/translation.json';
import translationZHCN from '../../../static/locales/zh_CN/translation.json';
import translationZHTW from '../../../static/locales/zh_TW/translation.json';

const languages = {
	en: {
		translation: translationEN,
		name: 'English',
	},
	'zh_CN': {
		translation: translationZHCN,
		name: '简体中文',
	},
	'zh_TW': {
		translation: translationZHTW,
		name: '繁體中文',
	},
};

export default languages;
