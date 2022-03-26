export const imgBGF = async (selector) => {
    if (selector) {
        const imageList = [
            'uOi3lg8fGl4',
            'uSFOwYo1qEw',
            'tZaA8VqJG3g',
            '78A265wPiO4'
        ];

        const randomIdx = Math.floor(Math.random() * 5);
        // eslint-disable-next-line no-undef
        const rawImage = new Image();
        rawImage.src = `https://source.unsplash.com/${imageList[randomIdx]}`;
        await rawImage.decode();

        console.log(`rawImage: ${rawImage.src}`);

        /* eslint-disable no-undef */
        const img = document.createElement('img');
        img.src = rawImage.src;
        const frame = document.getElementById(selector) ||
        document.getElementsByClassName(selector).item(0);
        /* eslint-enable no-undef */
        if (frame) {
            frame.appendChild(img);
        }
        return img;
    }
};
