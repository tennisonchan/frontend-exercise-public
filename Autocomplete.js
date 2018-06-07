export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign(
      {
        numOfResults: 10,
        data: [],
        onSelect: () => {
          this.onHide();
        },
        onFetch: fetchDefault(options.data),
      },
      options,
    );
    Object.assign(this, { rootEl, options });

    this.init();
  }

  init() {
    this.onQueryChange = debouce(this.onQueryChange, 300);
    this.inputEl = createQueryInputEl({
      onInput: e => this.onQueryChange(e.target.value),
      onBlur: () => {
        this.onHide();
      },
    });

    this.rootEl.appendChild(this.inputEl);

    this.listEl = createUlElement();
    this.rootEl.appendChild(this.listEl);
    this.onHide();
  }

  onShow() {
    this.rootEl.classList.remove('hidden');
  }

  onHide() {
    this.rootEl.classList.add('hidden');
  }

  onQueryChange(query) {
    if (!query) {
      this.updateDropdown([]);
      return;
    }

    this.getResults(query).then(results => {
      this.updateDropdown(results);
    });
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query) {
    const { onFetch, numOfResults } = this.options;
    return onFetch(query, numOfResults);
  }

  updateDropdown(results) {
    const { onSelect } = this.options;
    this.onShow();

    this.listEl.innerHTML = '';
    this.listEl.appendChild(
      createResultsEl(results, e => {
        onSelect(e);
        this.onHide();
      }),
    );
  }
}

function createLiElement({ text }, onSelect) {
  return Object.assign(document.createElement('li'), {
    className: 'result',
    textContent: text,
    onclick: onSelect,
  });
}

function createResultsEl(results, onSelect) {
  const fragment = document.createDocumentFragment();

  results
    .map(result => createLiElement(result, onSelect))

    .forEach(el => fragment.appendChild(el));

  return fragment;
}

function createQueryInputEl({ onInput, onBlur }) {
  return Object.assign(document.createElement('input'), {
    type: 'search',
    name: 'query',
    autocomplete: 'off',
    oninput: onInput,
    onblur: onBlur,
  });
}

function createUlElement() {
  return Object.assign(document.createElement('ul'), { className: 'results' });
}

function debouce(fn, timeout) {
  let timeoutId = null;

  return function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, arguments);
    }, timeout);
  };
}

function fetchDefault(data = []) {
  return (query, numOfResults) => {
    query = query.toLowerCase();

    return new Promise((resolve, reject) => {
      resolve(
        data
          .filter(({ text }) => text.toLowerCase().includes(query))

          .slice(0, numOfResults),
      );
    });
  };
}
