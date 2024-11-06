import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route } from 'react-router-dom';

import { NavLink } from 'react-router-dom';
import * as Component from "./components"

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
