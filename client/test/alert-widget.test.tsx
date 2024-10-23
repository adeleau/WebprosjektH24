import * as React from 'react';
import { Alert } from '../src/widgets';
import { shallow } from 'enzyme';

describe('Alert tests', () => {
  test('No alerts initially', () => {
    const wrapper = shallow(<Alert />);

    expect(wrapper.matchesElement(<div></div>)).toEqual(true);
  });

  test('Show alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test 1');
    Alert.danger('test 2');
    Alert.danger('test 3');



    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test 1
              <button />
            </div>
            <div>
              test 2
              <button />
            </div>
            <div>
              test 3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });

  test('Close alert message', (done) => {
    const wrapper = shallow(<Alert />);

    Alert.danger('test 1');
    Alert.danger('test 2');
    Alert.danger('test 3');


    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test 1
              <button />
            </div>
            <div>
              test 2
              <button />
            </div>
            <div>
              test 3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      wrapper.find('button.btn-close').at(1).simulate('click');

      expect(
        wrapper.matchesElement(
          <div>
            <div>
              test 1
              <button />
            </div>
            <div>
              test 3
              <button />
            </div>
          </div>
        )
      ).toEqual(true);

      done();
    });
  });
});
