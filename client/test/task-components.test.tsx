import * as React from 'react';
import { TaskList, TaskNew, TaskDetails, TaskEdit } from '../src/task-components';
import { shallow } from 'enzyme';
import { Form, Button, Column } from '../src/widgets';
import { NavLink } from 'react-router-dom';
import taskService from '../src/task-service';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', done: false , description: 'PPT 1 og 2' },
        { id: 2, title: 'Møt opp på forelesning', done: false, description: 'Uke 34' },
        { id: 3, title: 'Gjør øving', done: false, description: 'Øving 2' },
      ]);
    }

    get(id: number) {
      return Promise.resolve({
        id: 1, title: 'Les leksjon', done: false, description: 'PPT 1 og 2'
      })
    };

    create() {
      return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
    }

    updateTask(id: number, title: string, done: boolean, description: string) {
      return Promise.resolve(id); // Mock successful update by returning the same id
    }
  
    deleteTask(id: number) {
      return Promise.resolve(id); // Mock successful deletion by returning the deleted task ID
    }
  }
  return new TaskService();
});

describe('Task component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    // Wait for events to complete
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ])
      ).toEqual(true);
      done();
    });
  });

  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<TaskNew />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });

  test('TaskDetails draws correctly', async () => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    
      expect(wrapper.containsMatchingElement(
          <Column>Les leksjon</Column>
      )).toEqual(true);
      expect(wrapper.containsMatchingElement(
        <Column>PPT 1 og 2</Column>
      )).toEqual(true);
      const checkboxWrapper = wrapper.find(Form.Checkbox);
      expect(checkboxWrapper.prop('checked')).toBe(false);
      expect(checkboxWrapper.prop('disabled')).toBe(true);
  });

  test('TaskDetails draws correctly (snapshot)', async () => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    
      expect(wrapper).toMatchSnapshot();
  });

  test('TaskEdit draws correctly (snapshot)', async () => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    await new Promise(resolve => setTimeout(resolve, 0));
    
      expect(wrapper).toMatchSnapshot();
  });

  test('TaskEdit correctly sets location on save', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    wrapper.find(Button.Success).simulate('click');
    // Wait for events to complete
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/1');
      done();
    });
  });

  test('TaskList navigates to new task form on New task button click', () => {
    const wrapper = shallow(<TaskList />);
  
    wrapper.find(Button.Success).simulate('click');
    expect(location.hash).toEqual('#/tasks/new');
  });

  test('TaskEdit deletes task on Delete button click', async () => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    wrapper.find(Button.Danger).simulate('click');
    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks');
    });
  });
  
  test('TaskEdit calls updateTask with correct arguments', async () => {
    const spyUpdateTask = jest.spyOn(taskService, 'updateTask');
    
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);
    
    // Wait for component to mount and update with the task
    await new Promise(resolve => setTimeout(resolve, 0));
  
    // Simulate user input
    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Oppdatert tittel' } });
    wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: true } });
    wrapper.find(Form.Textarea).simulate('change', { currentTarget: { value: 'Oppdatert beskrivelse' } });
    
    // Simulate form submission
    wrapper.find(Button.Success).simulate('click');
    
    // Wait for the update to complete
    await new Promise(resolve => setTimeout(resolve, 0));
  
    // Check if updateTask was called with correct arguments
    expect(spyUpdateTask).toHaveBeenCalledWith(1, 'Oppdatert tittel', true, 'Oppdatert beskrivelse');
  });
  
  
  
});
