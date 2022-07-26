import iconv from 'iconv-lite';

const isEncoding = (string, encoding = 'utf-8') => {
	const parseEncoding = /encoding=[\"\'](?<encoding>[^\"\']+)[\"\']/;
	const parsedString = string.toString().match(parseEncoding)?.groups?.encoding || '';

	return parsedString.toLowerCase() === encoding.toLowerCase();
}

const replaceEncodingAttr = (string, newEncoding = 'utf-8') => {
	const parseFullEncoding = /encoding=[\"\'][^\"\']+[\"\']/;

	return string.replace(parseFullEncoding, `encoding="${newEncoding}"`);
}

const decodeWIN1251 = (string) => iconv.decode(string, 'cp1251');

export {
	isEncoding,
	replaceEncodingAttr,
	decodeWIN1251
}
