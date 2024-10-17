import { ElementsType, getElements } from './sortBy.js';
import { CommentBlock } from './commentBlock.js';

enum Elements {
  commentsBlock = 'commentsBlock',
}

export class Main {
  private readonly _basis: HTMLElement;
  private readonly _sections: ElementsType = {};
  private _appInner = `
        <section class="comment" data-element="commentsBlock"></section>
  `;

  constructor(basis: HTMLElement) {
    this._basis = basis;
  }

  public output() {
    this._basis.innerHTML = this._appInner;
    getElements(this._basis, this._sections);
    new CommentBlock(this._sections[Elements.commentsBlock]);
  }
}