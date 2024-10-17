import { getElements } from './sortBy.js';
import { CommentBlock } from './commentBlock.js';
var Elements;
(function (Elements) {
    Elements["commentsBlock"] = "commentsBlock";
})(Elements || (Elements = {}));
export class Main {
    constructor(basis) {
        this._sections = {};
        this._appInner = `
        <section class="comment" data-element="commentsBlock"></section>
  `;
        this._basis = basis;
    }
    output() {
        this._basis.innerHTML = this._appInner;
        getElements(this._basis, this._sections);
        new CommentBlock(this._sections[Elements.commentsBlock]);
    }
}
