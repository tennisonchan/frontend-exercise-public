export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  init() {
    this.onQueryChange = debouce(this.onQueryChange, 300);

    this.rootEl.appendChild(
      createQueryInputEl({
        onInput: e => this.onQueryChange(e.target.value),
      }),
    );

    this.listEl = createUlElement();
    this.rootEl.appendChild(this.listEl);
  }

  onQueryChange(query) {
    const { data, numOfResults } = this.options;

    this.updateDropdown(this.getResults(query, data).slice(0, numOfResults));
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];
    query = query.toLowerCase();
    return data.filter(({ text }) => text.toLowerCase().includes(query));
  }

  updateDropdown(results) {
    const { onSelect = f => f } = this.options;

    this.listEl.innerHTML = '';
    this.listEl.appendChild(createResultsEl(results, onSelect));
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

function createQueryInputEl({ onInput }) {
  return Object.assign(document.createElement('input'), {
    type: 'search',
    name: 'query',
    autocomplete: 'off',
    oninput: onInput,
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
