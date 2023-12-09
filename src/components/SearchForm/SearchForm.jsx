import { Component } from 'react';

import { FiSearch } from 'react-icons/fi';
import { FormBtn, InputSearch, SearchFormStyled } from './SearchForm.styled';

export class SearchForm extends Component {
  state = {
    searchQuery: '',
  };
  handleChange = e => {
    this.setState({ searchQuery: e.target.value });
  };
  handleSubmit = e => {
    const { searchQuery } = this.state;
    e.preventDefault();
    if (!searchQuery.trim()) return alert('Can not be empty');
    this.props.onSubmit(searchQuery);
    this.setState({ searchQuery: '' });
  };
  render() {
    const { searchQuery } = this.state;

    return (
      <SearchFormStyled onSubmit={this.handleSubmit}>
        <FormBtn type="submit">
          <FiSearch size="16px" />
        </FormBtn>
        <InputSearch
          value={searchQuery}
          onChange={this.handleChange}
          placeholder="What do you want to write?"
          name="search"
          required
          autoFocus
        />
      </SearchFormStyled>
    );
  }
}
