export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign(
      {
        numOfResults: 10,
        data: [],
        onSelect: () => {
          this.onHide();
        },
        activeClassName: 'active',
        hiddenClassName: 'hidden',
        onFetch: fetchDefault(options.data),
      },
      options,
    );
    Object.assign(this, { rootEl, options });

    this.init();
  }

  init() {
    this.activeIndex = 0;
    this.onQueryChange = debouce(this.onQueryChange, 300);
    this.inputEl = createQueryInputEl({
      oninput: e => this.onQueryChange(e.target.value),
    });

    this.rootEl.appendChild(this.inputEl);

    this.listEl = createUlElement();
    this.rootEl.appendChild(this.listEl);
    this.onHide();

    this.rootEl.addEventListener('keydown', e => {
      let { keyCode, target } = e;

      if (keyCode === 40 || keyCode === 38) {
        this.updateItemFocus(keyCode === 38);
      }
      if (keyCode === 13) {
        this.clickOnItem();
      }
    });
  }

  clickOnItem() {
    let { activeClassName } = this.options;
    let { element } = this.getItemWithClassName(this.rootEl.querySelectorAll('.result'), activeClassName);

    element.dispatchEvent(new Event('click'));
  }

  getItemWithClassName(els, classname) {
    let activeIndex = 0;
    let element = null;
    els.forEach((el, index) => {
      if (el.classList.contains(classname)) {
        activeIndex = index;
        element = el;
      }
    });

    return {
      activeIndex,
      element,
    };
  }

  updateItemFocus(isUp) {
    let { activeClassName } = this.options;
    let extra = isUp ? -1 : 1;
    let els = this.rootEl.querySelectorAll('.result');
    let { element, activeIndex = 0 } = this.getItemWithClassName(els, activeClassName);

    element.classList.remove(activeClassName);
    activeIndex = (activeIndex + extra + els.length) % els.length;
    els[activeIndex].classList.add(activeClassName);
  }

  onShow() {
    this.rootEl.classList.remove(this.options.hiddenClassName);
  }

  onHide() {
    this.rootEl.classList.add(this.options.hiddenClassName);
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
    const { onSelect, activeClassName } = this.options;
    this.onShow();

    let listItems = createListItemsFragment(results, e => {
      onSelect(e);
      this.onHide();
    });

    listItems.children[0].classList.add(activeClassName);

    this.listEl.innerHTML = '';
    this.listEl.appendChild(listItems);
  }
}

function createListItem({ text }, onSelect) {
  return Object.assign(document.createElement('li'), {
    className: 'result',
    textContent: text,
    onclick: onSelect,
  });
}

function createListItemsFragment(results, onSelect) {
  const fragment = document.createDocumentFragment();

  results
    .map(result => createListItem(result, onSelect))

    .forEach(el => fragment.appendChild(el));

  return fragment;
}

function createQueryInputEl(opts = {}) {
  return Object.assign(
    document.createElement('input'),
    {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    },
    opts,
  );
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
