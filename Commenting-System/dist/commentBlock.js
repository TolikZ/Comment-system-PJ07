import { getElements } from './sortBy.js';
import { CallToAction } from './cta.js';
import { CommentForm } from './commentForm.js';
import { Comments } from './comments.js';
var Elements;
(function (Elements) {
    Elements["cta"] = "cta";
    Elements["commentForm"] = "commentForm";
    Elements["comments"] = "comments";
})(Elements || (Elements = {}));
export class CommentBlock {
    constructor(commentBlock) {
        this._elements = {};
        this._innerCommentBlock = `
    <div class="comment__cta" data-element="${Elements.cta}"></div>
    <div class="comment__form" data-element="${Elements.commentForm}"></div>
    <div data-element="${Elements.comments}"></div>
  `;
        this.updateCounter = () => {
            this._cta.updateCounter();
        };
        this.updateComments = () => {
            this._comments.updateComments();
        };
        this.showFavoriteComments = () => {
            this._comments.showFavoriteComments();
        };
        this._commentBlock = commentBlock;
        this.output();
    }
    output() {
        this._commentBlock.innerHTML = this._innerCommentBlock;
        getElements(this._commentBlock, this._elements);
        if (!localStorage.getItem('comments'))
            localStorage.setItem('comments', '[]');
        localStorage.setItem('sort', 'date');
        if (!localStorage.getItem('favorite'))
            localStorage.setItem('favorite', '[]');
        localStorage.setItem('favoriteState', 'false');
        this._cta = new CallToAction(this._elements[Elements.cta], this.updateComments, this.showFavoriteComments);
        new CommentForm(this._elements[Elements.commentForm], this.updateComments, this.updateCounter);
        this._comments = new Comments(this._elements[Elements.comments]);
    }
}
