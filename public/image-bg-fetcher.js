(async () => {
	const images = [
		'uOi3lg8fGl4',
		'uSFOwYo1qEw',
		'tZaA8VqJG3g',
		'78A265wPiO4',
		'TAhsXhWipwg',
		'dQBZY7yEVpc'
	];

	const index = Math.floor(Math.random() * 5);
	const imageUrl = `https://source.unsplash.com/${images[index]}`;

	const rawImage = new Image();
	rawImage.src = imageUrl;
	await rawImage.decode();

	const background = document.createElement('img');
	background.src = imageUrl;

	const poster = document.getElementById('poster');
	poster.appendChild(background);
  })();
