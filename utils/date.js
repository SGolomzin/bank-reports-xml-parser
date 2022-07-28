import moment from 'moment';

const formatConsoleDate = (date) => {
	let hour = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	let milliseconds = date.getMilliseconds();

	return '[' +
		((hour < 10) ? '0' + hour : hour) +
		':' +
		((minutes < 10) ? '0' + minutes : minutes) +
		':' +
		((seconds < 10) ? '0' + seconds : seconds) +
		'.' +
		('00' + milliseconds).slice(-3) +
		']';
}

const createCurrentDateString = (date) => {
	let year = date.getFullYear();
	let month = String(date.getMonth() + 1).padStart(2, '0');
	let day = String(date.getDate()).padStart(2, '0');
	let hours = String(date.getHours()).padStart(2, '0');
	let minutes = String(date.getMinutes()).padStart(2, '0');
	let seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day}_${hours}꞉${minutes}꞉${seconds}`;
}

const parseDateValue = (value = '', format = ["YYYY-MM-DD hh:mm:ss", "MM-DD-YYYY hh:mm:ss", "DD-MM-YYYY hh:mm:ss"], strict = false) => {
	return !moment(value, format, strict).isValid()
		? "0x00"
		: moment(value, format, strict);
}

export {
	formatConsoleDate,
	createCurrentDateString,
	parseDateValue
}