# Solution Docs

- Enhance the component so that it also accepts an HTTP endpoint as data source.
- Implement keyboard shortcuts to navigate the results dropdown using up/down arrow keys and to select a result using the Enter key.
  <!-- You can include documentation, additional setup instructions, notes etc. here -->

## Usage

```js
new Autocomplete(document.getElementById('root'), {
  numOfResults: 20,
  onSelect: e => {
    console.log('selected github user id:', ghUserId);
  },
  onFetch: (query, numOfResults) => {
    return fetch(`https://api.github.com/search/users?q=${query}&per_page=${perPage}`)
      .then(resp => resp.json())
      .then(json => json.items.map(({ login }) => ({ text: login })));
  },
  onHide: () => {
    console.log('hide the list);
  }
});
```

## Options

| Options         | Default  | Description                                            |
| :-------------- | :------- | ------------------------------------------------------ |
| data            | `[]`     | The data shown when the `onFetch` function is not set. |
| numOfResults    | `10`     | The number of results shown.                           |
| activeClassName | `active` | The classname of the active item.                      |
| hiddenClassName | `hidden` | The classname of the hidden list.                      |

## Settings

| Setting    | Description                                                                                                                    |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `onSelect` | `function (event) {}` function called when users select on the item from the list.                                             |
| `onFetch`  | `function (query, numOfResults) {}` called when users input the query in the input box to fetch the data from the server-side. |
| `onHide`   | `function (rootElement) {}` called before list items will be hidden.                                                           |
