import fs from 'fs';
import path from 'path';

const transformFiles = (dirpath, filenames = [], fn = () => { }) => {
	return Promise.allSettled(filenames.map(
		filename => fs.promises.readFile(path.resolve(dirpath, filename))
			.then(filedata => fn(filedata, filename))
			.catch(err => {
				err.filename = filename;
				return Promise.reject(err);
			})
	));
};

const checkFileExists = async (file) => {
	try {
		await fs.promises.access(file, fs.constants.F_OK);
		return true;
	} catch (_) {
		return false;
	}
}

export {
	transformFiles,
	checkFileExists
}


