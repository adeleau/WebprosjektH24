import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route} from 'react-router-dom';
import * as App from './components'

let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <Route exact path="/" component={App.Home} />
      <Route exact path="/about" component={App.About} />
      <Route exact path="/series/:series_id" component={App.SeriesList} />
      <Route exact path="/series/:series/angels" component={App.AngelList} />
      <Route exact path="/angels/:angel_id" component={App.AngelDetails} />
      <Route exact path="/masterlist" component={App.MasterList} />
      <Route exact path="/popular" component={App.Popular} />
      <Route exact path="/posts" component={App.PostList} />
      <Route exact path="/posts/new" component={App.PostNew} />
      <Route exact path="/posts/:post_id(\d+)" component={App.PostDetails} />
      <Route exact path="/posts/:post_id(\d+)/edit" component={App.PostEdit} />
      <Route exact path="/trading" component={App.Trading} />    
    </HashRouter>
  );


  