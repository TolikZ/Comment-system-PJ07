import { Main } from './main.js';
class App {
    constructor() {
        this.basis = document.getElementById('app');
        this.main = new Main(this.basis);
        this.output();
    }
    output() {
        this.main.output();
    }
}
new App();
