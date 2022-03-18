export default async (selector, list) => {
	// fallback
    const imageList = [
		'uOi3lg8fGl4',
		'uSFOwYo1qEw',
		'tZaA8VqJG3g',
		'78A265wPiO4'
    ];
    // [
    //    'TAhsXhWipwg',
    //    'dQBZY7yEVpc',
    //    'photo - 1517059224940 - d4af9eec41b7'
    // ]

    imageList.concat(list);

	const randomIdx = Math.floor(Math.random() * 5);
    const rawImage = new Image();
    rawImage.src = `https://source.unsplash.com/${imageList[randomIdx]}`;
	await rawImage.decode();

    const img = document.createElement('img');
    img.src = rawImage.src;

    if (selector) {
        const frame = document.getElementById(selector)
            || document.getElementsByClassName(selector).item(0);

        if (frame) {
            frame.appendChild(img)
        }
    }

    return img;
};
