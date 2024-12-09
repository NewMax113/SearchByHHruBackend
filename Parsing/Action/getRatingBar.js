import getElementColor from "./getElementColor.js";

const getRatingBar = async (page) => {
    const green = await getElementColor(page, '#rating-bar > div.green');
    const yellow = await getElementColor(page, '#rating-bar > div.yellow');
    const red = await getElementColor(page, '#rating-bar > div.red');

    let color = { green, yellow, red }
    
    return color
}

export default getRatingBar