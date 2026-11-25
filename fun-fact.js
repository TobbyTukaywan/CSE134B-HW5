class FunFact extends HTMLElement {
    connectedCallback() {
        const header = document.createElement('h2');
        header.textContent = 'Cat Fact:';

        const factText = document.createElement('p');
        factText.textContent = 'No fact loaded.';
        factText.id = 'fact-text'
        factText.hidden = 'hidden';
        
        const factButton = document.createElement('button');
        factButton.textContent = 'Tell me something about cats';
        factButton.id = 'fact-button';
        factButton.hidden = 'hidden';

        const factStatus = document.createElement('p');
        factStatus.textContent = 'Awaiting fetch request...';
        factStatus.id = 'fact-status'
        factStatus.hidden = 'hidden';

        const frag = document.createDocumentFragment();
        frag.append(header, factText, factButton, factStatus);
        this.appendChild(frag);
        factStatus.setAttribute('role', 'status');

        let mode = 'minimized';
        try {
            const savedMode = localStorage.getItem('fun-fact-mode');
            if (savedMode === 'minimized' || savedMode === 'expanded') {
                mode = savedMode;
            }
        } catch (e) {
            console.error('Error reading fun fact preference:', e);
        }
        this.toggleAttribute('minimized', mode === 'minimized');
        this.updateMini();

        this.fetchFact();

        factButton.addEventListener('click', () => this.fetchFact());
        document.querySelector('#minimize-button').addEventListener('click', () => this.minimizeToggle());
    }

    minimizeToggle() {
        const isMinimized = this.toggleAttribute('minimized');
        try {
            localStorage.setItem('fun-fact-mode', isMinimized ? 'minimized' : 'expanded');
        } catch (e) {
            console.error('Error saving fun fact preference:', e);
        }
    }

    async fetchFact() {
        const factStatus = this.querySelector('#fact-status');
        const factButton = this.querySelector('#fact-button');
        factButton.disabled = true;
        factStatus.textContent = "Loading cat fact..."
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
            factText.textContent = data.fact;
            factStatus.textContent = "Cat fact successfully loaded!";
        } catch (error) {
            console.error("Could not load the fact.", error);
            factStatus.textContent = "Cat fact failed to load.";
        }
        factButton.disabled = false;
    }

    static get observedAttributes() {
        return ['minimized'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'minimized') {
            this.updateMini()
        }
    }

    updateMini() {
        const isMinimized = this.hasAttribute('minimized');
        this.querySelector('#fact-text').toggleAttribute('hidden', isMinimized);
        this.querySelector('#fact-button').toggleAttribute('hidden', isMinimized);
        this.querySelector('#fact-status').toggleAttribute('hidden', isMinimized);
        const minimizeButton = document.querySelector('#minimize-button');
        if (minimizeButton) {
            minimizeButton.textContent = isMinimized ? 'Show cat fact' : 'Hide cat fact';
        }
    }
}

customElements.define('fun-fact', FunFact);