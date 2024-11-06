import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route } from 'react-router-dom';

import { NavLink } from 'react-router-dom';
import * as Component from "./components"

/*
class Menu extends Component {
  state ={
    showDropDown: false,
  };
  handleMouseEnter =() => {
    this.setState({showDropDown: true});
  };
  handleMouseLeave =() => {
    this.setState({showDropDown: false});
  };

  render() {
    return (
      <NavBar brand="Sonny Angel Wiki">
        <NavBar.Link to="/about">About</NavBar.Link>
        <div
          onMouseEnter={this.handleMouseEnter} 
          onMouseLeave={this.handleMouseLeave} 
          style={{ position: 'relative' }} >

          <NavBar.Link to="/angels">Collection</NavBar.Link>

          {this.state.showDropDown && (
            <div style={dropdownStyles}>
              <NavLink to="/angels/animals" style={dropdownItemStyles}>Animals Series🐨</NavLink>
              <NavLink to="/angels/vegetable" style={dropdownItemStyles}>Vegetable Series🥕</NavLink>
              <NavLink to="/angels/marine" style={dropdownItemStyles}>Marine Series🪼</NavLink>
              <NavLink to="/angels/fruit" style={dropdownItemStyles}>Fruit Series🍎</NavLink>
              <NavLink to="/angels/flower" style={dropdownItemStyles}>Flower Series🌺</NavLink>
              <NavLink to="/angels/sweets" style={dropdownItemStyles}>Sweets Series🧁</NavLink>
              <NavLink to="/angels/catlife" style={dropdownItemStyles}>Cat Life😽</NavLink>
              <NavLink to="/angels/dino" style={dropdownItemStyles}>Dinosaur🦖</NavLink>
              <NavLink to="/angels/christmas" style={dropdownItemStyles}>Dreaming Christmas🎁</NavLink>
              <NavLink to="/angels/valentine" style={dropdownItemStyles}>Valentine Series💝</NavLink>
              <NavLink to="/angels/bugs" style={dropdownItemStyles}>Bug's World🐞</NavLink>
              <NavLink to="/angels/dog" style={dropdownItemStyles}>Dog Time🐶</NavLink>
            </div>
          )}
        </div>

        <NavBar.Link to="/posts">Community</NavBar.Link>
      </NavBar>
    );
  }
}

const dropdownStyles: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: 'white',
  border: '1px solid #ddd',
  boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
  zIndex: 1,
  minWidth: '400px',
  display: 'grid',           
  gridTemplateColumns: '1fr 1fr', 
};

const dropdownItemStyles: React.CSSProperties = {
  display: 'block',
  padding: '8px 16px',
  color: '#333',
  backgroundColor: '#fcdeed',
  textDecoration: 'none',
};
//bør være i css fil, men kan flytte senere

class Home extends Component {
  render() {
    return <Card title="Welcome">He may bring you happiness</Card>;
  }
}

class About extends Component {
  render() {
    return (
      <>
        <Card title="About">
          <p>This is Sonny Angel</p>
        </Card>
      </>
    );
  }
}*/

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
        {/*<Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/angels" component={AngelList} /> {/* collection}
        <Route exact path="/angels/:angel_id(\d+)" component={AngelDetails} />
        <Route exact path="/posts" component={PostList} /> {/* community 
        <Route exact path="/posts/:post_id(\d+)" component={PostDetails} />
        <Route exact path="/posts/new" component={PostNew} />
        <Route exact path="/posts/:post_id(\d+)/edit" component={PostEdit} />
          */}
          <Component.Home/>
    </HashRouter>,
  );
