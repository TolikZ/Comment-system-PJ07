import { Main } from './main.js';

class App {
  basis = document.getElementById('app') as HTMLElement;
  main = new Main(this.basis);

  constructor() {
    this.output();
  }

  private output() {
    this.main.output();
  }
}

new App();