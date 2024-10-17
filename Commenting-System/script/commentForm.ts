import { ElementsType, getElements } from './sortBy.js';
import { UserType, getUser } from './request.js';
import { CommentType } from './comment.js';

enum Elements {
  avatar = 'avatar',
  name = 'name',
  charCount = 'charCount',
  error = 'error',
  form = 'form',
  textArea = 'textArea',
  buttonSubmit = 'buttonSubmit',
  buttonCancel = 'buttonCancel',
}

export class CommentForm {
  private readonly _commentForm: HTMLElement;
  private readonly _elements: ElementsType = {};
  private _charCount: number | undefined;
  private _user!: UserType;
  private readonly _parent: CommentType | null;

  private readonly _updateComments: () => void;
  private readonly _updateCounter: () => void;

  private _innerCommentForm = `
    <form action="/" class="form" data-element="${Elements.form}">
      <div class="comment__user-box">
        <img class="avatar" alt="commenter avatar" data-element="${Elements.avatar}">
        <p class="user-name" data-element="${Elements.name}"></p>
      </div>
      <div class="comment__textarea">
        <textarea class="textarea" placeholder="Введите текст сообщения..." data-element="${Elements.textArea}"></textarea>
        <div class="textarea-validation">
          <p class="textarea-validation__text" data-element="${Elements.charCount}">Макс. 1000 символов</p>
        </div>
      </div>
      <div class="comment__btn-box">
        <p class="error-message" data-element="${Elements.error}">Слишком длинное сообщение</p>
        <button class="form__btn btn" type="submit" disabled data-element="${Elements.buttonSubmit}">Отправить</button>
        <button class="form__btn btn" data-element="${Elements.buttonCancel}">Отмена</button>
      </div>
    </form>
  `;
  constructor(
    commentForm: HTMLElement,
    updateComments: () => void,
    updateCounter: () => void,
    parent: CommentType | null = null
  ) {
    this._commentForm = commentForm;
    this._parent = parent;

    this._updateComments = updateComments;
    this._updateCounter = updateCounter;
    this.output();
  }

  async output() {
    this._commentForm.innerHTML = this._innerCommentForm;
    getElements(this._commentForm, this._elements);

    if (!this._parent) {
      this._elements[Elements.buttonCancel].remove();
      delete this._elements[Elements.buttonCancel];
    }

    await getUser()
      .then((user) => (this._user = user))
      .then(() => this.updateUser());

    this.addListeners();
  }

  addListeners() {
    const form = this._elements[Elements.form] as HTMLFormElement;
    const textArea = this._elements[Elements.textArea] as HTMLTextAreaElement;
    const cancelBtn = this._elements[Elements.buttonCancel] as HTMLButtonElement;

    form.addEventListener('submit', (event) => this.onSubmit(event, textArea));
    cancelBtn?.addEventListener('click', this.onCancel);
    textArea.addEventListener('input', () => this.autoResizeTextArea(textArea));
  }

  onSubmit = (event: Event, textArea: HTMLTextAreaElement) => {
    event.preventDefault();

    if (!textArea.value) return;

    const comments = JSON.parse(localStorage.getItem('comments') as string);
    const data: CommentType = {
      ...this._user,
      comment: textArea.value,
      date: new Date(),
      favorite: false,
      rating: Math.floor(Math.random() * 201 - 100),
      plus: true,
      minus: true,
      parent: this._parent?.username,
    };

    comments.push(data);
    localStorage.setItem('comments', JSON.stringify(comments));

    textArea.value = '';
    this._updateCounter();
    this._updateComments();
    this.output();
  };

  onCancel = () => {
    this._commentForm.remove();
  };

  autoResizeTextArea(textArea: HTMLTextAreaElement) {
    const countLineBreaks = textArea.value.match(/\n/g);

    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;

    if (countLineBreaks) {
      textArea.rows = countLineBreaks.length + 1;
    } else if (textArea.value.length <= 36 && !countLineBreaks) {
      textArea.style.height = '61px';
    }

    this.formSymbolValidation(textArea);
  }

  formSymbolValidation(textArea: HTMLTextAreaElement) {
    const charCountElement = this._elements.charCount as HTMLParagraphElement;
    const errorElement = this._elements.error as HTMLDivElement;
    const buttonElement = this._elements.buttonSubmit as HTMLButtonElement;
    this._charCount = textArea.value.length;

    this._charCount && this._charCount <= 1000
      ? (buttonElement.disabled = false)
      : (buttonElement.disabled = true);

    if (this._charCount || this._charCount === 0)
      charCountElement.innerText = `${this._charCount}/1000`;

    this._charCount > 1000
      ? ((charCountElement.style.color = 'rgba(255, 0, 0)'),
        (charCountElement.style.opacity = '1'),
        (errorElement.style.visibility = 'visible'))
      : ((charCountElement.style.color = 'rgba(0, 0, 0'),
        (charCountElement.style.opacity = '0.4'),
        (errorElement.style.visibility = 'hidden'));
  }

  updateUser() {
    this._elements[Elements.avatar].setAttribute('src', this._user.avatar);
    this._elements[Elements.name].innerHTML = this._user.name;
  }
}