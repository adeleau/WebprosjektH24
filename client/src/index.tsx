import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { NavBar, Card, Alert } from './widgets';
import {
  AngelList,
  AngelDetails,
  PostList,
  PostDetails,
  PostEdit,
  PostNew,
} from './angel-components';

class Menu extends Component {
  render() {
    return (
      <NavBar brand="Sonny Angel Wiki">
        <NavBar.Link to="/about">About</NavBar.Link>
        <NavBar.Link to="/angels">Collection</NavBar.Link>
        <NavBar.Link to="/posts">Community</NavBar.Link>
      </NavBar>
    );
  }
}

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
}

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <div>
        <Alert />
        <Menu />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/angels" component={AngelList} /> {/* collection */}
        <Route exact path="/angels/:angel_id(\d+)" component={AngelDetails} />
        <Route exact path="/posts" component={PostList} /> {/* community */}
        <Route exact path="/posts/:post_id(\d+)" component={PostDetails} />
        <Route exact path="/posts/new" component={PostNew} />
        <Route exact path="/posts/:post_id(\d+)/edit" component={PostEdit} />
      </div>
    </HashRouter>,
  );
