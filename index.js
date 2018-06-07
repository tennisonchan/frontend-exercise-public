import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';

// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation,
}));

const getGithubUserUrl = (query, perPage) => `https://api.github.com/search/users?q=${query}&per_page=${perPage}`;

new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: e => {
    console.log('selected state:', e);
  },
});

// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  onSelect: e => {
    console.log('selected github user id:', e);
  },
  onFetch: (query, numOfResults) => {
    return fetch(getGithubUserUrl(query, numOfResults))
      .then(resp => resp.json())
      .then(resp => resp.items.map(({ login }) => ({ text: login })));
  },
});
