// Custom Components

let currentAttributeNoteIndex = 0;

class DiceObject extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('dice-object');
		const templateContent = template.content;
		this.appendChild(templateContent.cloneNode(true));
		let sides = this.getAttribute('sides');
		this.innerHTML += `
			<div class="die">
				<div class="value">${sides}</div>
				<svg viewBox="0 0 33 33">
  					<use xlink:href="#d${sides}"></use>
				</svg>
			</div>
		`;
	}
}

customElements.define('dice-object', DiceObject);

class DiceIcon extends HTMLElement {
	constructor() {
		super();
		const template = document.getElementById('dice-icon');
		const templateContent = template.content;
		this.appendChild(templateContent.cloneNode(true));
		let sides = this.getAttribute('sides');
		this.innerHTML += `
			<div class="icon">${sides}
				<svg viewBox="0 0 12 12">
  					<use xlink:href="#d${sides}-icon"></use>
				</svg>
			</div>
		`;
	}

	connectedCallback() {
	this.querySelector('.icon').addEventListener('click', () => {

		let sides = this.getAttribute('sides');

		// adiciona dado
		let dice = `<dice-object sides="${sides}"></dice-object>`;
		document.getElementById('table-top').insertAdjacentHTML('beforeend', dice);

		// ativa botão roll
		document.getElementById('roll').removeAttribute('disabled');

		// pega o dado recém-criado
		let addedDie = document.querySelector('#table-top').lastElementChild;

		// clicar no dado remove ele
		addedDie.querySelector('.die').addEventListener('click', () => {

			addedDie.remove();

			// desativa roll se não houver mais dados
			let diceLeft = document.querySelectorAll('dice-object');

			if (diceLeft.length < 1) {
				document.getElementById('roll').setAttribute('disabled', '');
			}
		});
	});
}
	
}

customElements.define('dice-icon', DiceIcon);


// Roll the dice

document.getElementById('roll').addEventListener('click', function() {
	let dice = document.querySelectorAll('dice-object');
	let total = 0;
	
	dice.forEach((die) => {
		let sides = die.getAttribute('sides');
		let roll = Math.floor(Math.random() * sides + 1);

		die.querySelector('.value').innerText = roll;
		total += roll;
	});

	let notes = document.querySelectorAll('.attribute-note');

	if (notes.length > 0) {
		notes[currentAttributeNoteIndex].textContent = total;
		currentAttributeNoteIndex = (currentAttributeNoteIndex + 1) % notes.length;
	}
});

document.getElementById('clearDice').addEventListener('click', function() {

	document.getElementById('table-top').innerHTML = '';

	document.getElementById('roll').setAttribute('disabled', '');
});