interface ObjectData {
	[key: string]: { "v": string, "t": string }	
}

const allValuesEmpty = (o: ObjectData) => {
	let fl = true;

	for (let k in o) {
		if (o[k].v !== '') {
			fl = false;
			break;
		}
	}

	return fl;
};

export {
	allValuesEmpty
}