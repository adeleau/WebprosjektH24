// import * as React from 'react';
// import { AngelList, AngelNew, AngelDetails, AngelEdit } from '../src/angel-components';
// import { shallow } from 'enzyme';
// import { Form, Button, Column } from '../src/widgets';
// import { NavLink } from 'react-router-dom';
// import angelService from '../src/angel-service';

// jest.mock('../src/angel-service', () => {
//   class AngelService {
//     getAll() {
//       return Promise.resolve([
//         { angel_id: 1, name: '',series:, description: '', image:},
//         { angel_id: 2, name: '',series: , description: '', image: },
//         { angel_id: 3, name: '',series:, description: '', image: },
//       ]);
//     }

//     get(id: number) {
//       return Promise.resolve({
//         id: 1,
//         title: 'Les leksjon',
//         done: false,
//         description: 'PPT 1 og 2',
//       });
//     }

//     create() {
//       return Promise.resolve(4); // Same as: return new Promise((resolve) => resolve(4));
//     }

//     updateAngel(id: number, title: string, done: boolean, description: string) {
//       return Promise.resolve(id); // Mock successful update by returning the same id
//     }

//     deleteAngel(id: number) {
//       return Promise.resolve(id); // Mock successful deletion by returning the deleted angel ID
//     }
//   }
//   return new AngelService();
// });

// describe('Angel component tests', () => {
//   test('AngelList draws correctly', (done) => {
//     const wrapper = shallow(<AngelList />);

//     // Wait for events to complete
//     setTimeout(() => {
//       expect(
//         wrapper.containsAllMatchingElements([
//           <NavLink to="/angels/1">Les leksjon</NavLink>,
//           <NavLink to="/angels/2">Møt opp på forelesning</NavLink>,
//           <NavLink to="/angels/3">Gjør øving</NavLink>,
//         ]),
//       ).toEqual(true);
//       done();
//     });
//   });

//   test('AngelNew correctly sets location on create', (done) => {
//     const wrapper = shallow(<AngelNew />);

//     wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
//     // @ts-ignore
//     expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

//     wrapper.find(Button.Success).simulate('click');
//     // Wait for events to complete
//     setTimeout(() => {
//       expect(location.hash).toEqual('#/angels/4');
//       done();
//     });
//   });

//   test('AngelDetails draws correctly', async () => {
//     const wrapper = shallow(<AngelDetails match={{ params: { id: 1 } }} />);
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     expect(wrapper.containsMatchingElement(<Column>Les leksjon</Column>)).toEqual(true);
//     expect(wrapper.containsMatchingElement(<Column>PPT 1 og 2</Column>)).toEqual(true);
//     const checkboxWrapper = wrapper.find(Form.Checkbox);
//     expect(checkboxWrapper.prop('checked')).toBe(false);
//     expect(checkboxWrapper.prop('disabled')).toBe(true);
//   });

//   test('AngelDetails draws correctly (snapshot)', async () => {
//     const wrapper = shallow(<AngelDetails match={{ params: { id: 1 } }} />);
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     expect(wrapper).toMatchSnapshot();
//   });

//   test('AngelEdit draws correctly (snapshot)', async () => {
//     const wrapper = shallow(<AngelEdit match={{ params: { id: 1 } }} />);
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     expect(wrapper).toMatchSnapshot();
//   });

//   test('AngelEdit correctly sets location on save', (done) => {
//     const wrapper = shallow(<AngelEdit match={{ params: { id: 1 } }} />);
//     wrapper.find(Button.Success).simulate('click');
//     // Wait for events to complete
//     setTimeout(() => {
//       expect(location.hash).toEqual('#/angels/1');
//       done();
//     });
//   });

//   test('AngelList navigates to new angel form on New angel button click', () => {
//     const wrapper = shallow(<AngelList />);

//     wrapper.find(Button.Success).simulate('click');
//     expect(location.hash).toEqual('#/angels/new');
//   });

//   test('AngelEdit deletes angel on Delete button click', async () => {
//     const wrapper = shallow(<AngelEdit match={{ params: { id: 1 } }} />);
//     wrapper.find(Button.Danger).simulate('click');
//     setTimeout(() => {
//       expect(location.hash).toEqual('#/angels');
//     });
//   });

//   test('AngelEdit calls updateAngel with correct arguments', async () => {
//     const spyUpdateAngel = jest.spyOn(angelService, 'updateAngel');

//     const wrapper = shallow(<AngelEdit match={{ params: { id: 1 } }} />);

//     // Wait for component to mount and update with the angel
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     // Simulate user input
//     wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Oppdatert tittel' } });
//     wrapper.find(Form.Checkbox).simulate('change', { currentTarget: { checked: true } });
//     wrapper
//       .find(Form.Textarea)
//       .simulate('change', { currentTarget: { value: 'Oppdatert beskrivelse' } });

//     // Simulate form submission
//     wrapper.find(Button.Success).simulate('click');

//     // Wait for the update to complete
//     await new Promise((resolve) => setTimeout(resolve, 0));

//     // Check if updateAngel was called with correct arguments
//     expect(spyUpdateAngel).toHaveBeenCalledWith(
//       1,
//       'Oppdatert tittel',
//       true,
//       'Oppdatert beskrivelse',
//     );
//   });
// });
