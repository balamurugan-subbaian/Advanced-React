import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';
import EditUser, { UPDATE_USER_MUTATION } from '../components/EditUser';
import { fakeUser } from '../lib/testUtils';
import { CURRENT_USER_QUERY } from '../components/User';

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: fakeUser(),
      },
    },
  },
  {
    request: {
      query: UPDATE_USER_MUTATION,
      variables: {
        name: 'Westopher',
      },
    },
    result: {
      updateUser: {
        name: 'Westopher',
        __typename: 'User',
      },
    },
  },
];

describe('<EditUser/>', () => {
  it('renders', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <EditUser />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
  });

  it('displays changes', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <EditUser />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nameInput = wrapper.find('[name="name"]');
    nameInput.simulate('change', { target: { name: 'name', value: 'Scott' } });
    const diff = wrapper.find('pre[data-test="change"]');
    expect(diff.text()).toBe('{"name":"Scott"}');
  });

  it('calls update user when form is submitted', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <EditUser />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const nameInput = wrapper.find('[name="name"]');
    nameInput.simulate('change', { target: { name: 'name', value: 'Westopher' } });
    wrapper.find('form').simulate('submit');
    wrapper.update();
    expect(wrapper.find('[data-test="updated"]').text()).toBe('Updated!');
  });
});
