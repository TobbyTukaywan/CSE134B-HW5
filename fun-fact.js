class FunFact extends HTMLElement {
    connectedCallback() {
        const header = document.createElement('h2');
        header.textContent = 'Cat Fact:';

        const factText = document.createElement('p');
        factText.textContent = 'Placeholder cat fact!!!';
        factText.id = 'fact-text'
        factText.hidden = 'hidden';
        
        const factButton = document.createElement('button');
        factButton.textContent = 'Tell me something about cats';
        factButton.id = 'fact-button';
        factButton.hidden = 'hidden';

        // const factStatus = document.createElement('p');
        // factStatus.textContent = `${this.factidx} / ${this.#numfacts}`;
        // factStatus.id = 'fact-status'

        const frag = document.createDocumentFragment();
        frag.append(header, factText, factButton);
        this.appendChild(frag);

        this.setAttribute('minimized', 'minimized');
        this.updateMini(this.hasAttribute('minimized'))

        this.fetchFact();

        factButton.addEventListener('click', () => this.fetchFact());
        document.querySelector('#minimize-button').addEventListener('click', () => this.toggleAttribute('minimized'));
    }

    async fetchFact() {
        try {
            const response = await fetch('https://catfact.ninja/fact');
            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json();
            if (typeof data?.fact !== 'string') {
                throw new Error('Expected a fact in the response.');
            }

            const factText = this.querySelector('#fact-text');
            console.log(this);
            factText.textContent = data.fact;
        } catch (error) {
            console.error("Could not load the fact.", error);
        }
    }

    static get observedAttributes() {
        return ['minimized'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'minimized') {
            this.updateMini(this.hasAttribute('minimized'))
        }
    }

    updateMini(isMinimized) {
        const factText = this.querySelector('#fact-text');
        factText.toggleAttribute('hidden', isMinimized);
        const factButton = this.querySelector('#fact-button');
        factButton.toggleAttribute('hidden', isMinimized);
    }
}

customElements.define('fun-fact', FunFact);