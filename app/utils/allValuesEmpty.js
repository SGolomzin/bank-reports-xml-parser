const allValuesEmpty = (o) => {
    let fl = true;
    for (let k in o) {
        if (o[k].v !== '') {
            fl = false;
            break;
        }
    }
    return fl;
};
export { allValuesEmpty };
