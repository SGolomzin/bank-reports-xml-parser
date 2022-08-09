import fs from 'fs';
import path from 'path';

const transformFiles = (
	dirpath: string, 
	filenames: string[] = [],
	fn: { (buf: Buffer, filename?: string): Promise<unknown> } 
) => {
	return Promise.allSettled(filenames.map(
		filename => fs.promises.readFile(path.resolve(dirpath, filename))
			.then((buf: Buffer) => fn(buf, filename))
			.catch(err => {
				err.filename = filename;
				return Promise.reject(err);
			})
	));
};

const checkFileExists = async (file: string): Promise<boolean> => {
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


