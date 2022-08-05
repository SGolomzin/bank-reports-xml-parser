import iconv from 'iconv-lite';

const isEncoding = (string: string, encoding = 'utf-8'): boolean => {
	const parseEncoding = /encoding=[\"\'](?<encoding>[^\"\']+)[\"\']/;
	const parsedString = string.toString().match(parseEncoding)?.groups?.encoding || '';

	return parsedString.toLowerCase() === encoding.toLowerCase();
}

const replaceEncodingAttr = (string: string, newEncoding = 'utf-8'): string => {
	const parseFullEncoding = /encoding=[\"\'][^\"\']+[\"\']/;

	return string.replace(parseFullEncoding, `encoding="${newEncoding}"`);
}

const decodeWIN1251 = (string: Buffer): string => iconv.decode(string, 'cp1251');

export {
	isEncoding,
	replaceEncodingAttr,
	decodeWIN1251
}
