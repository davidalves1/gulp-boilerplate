'use strict';

const toogleButton = document.querySelector('toogleButton');

toogleButton.addEventListener('click', () => {
	const menu = document.querySelector("#top-menu");

	console.log(menu.classList.contains('responsive'));
    if (menu.classList.contains('responsive'))
        menu.className = '';
    else
        menu.className = 'responsive';
})