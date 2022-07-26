/**
 * @param {number} number 
 * @param {[string, string, string]} titles
 * Для удобства можно сверять с числами
 * 1, 3, 5 -- ['строка','строки','строк']
 * @returns {string}
 */
export const declOfNum = (number, titles) => {
	const cases = [2, 0, 1, 1, 1, 2]
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
};