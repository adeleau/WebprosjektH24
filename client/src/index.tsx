import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as Comp from './components/other-components'
import * as Series from './components/series-components'
import * as Angel from './components/angel-components'
import * as Post from './components/post-components'
import * as Register from './components/register-components';
import * as User from './components/user-components';
import * as Login from './components/login-components'
import { NotFound } from './components/not-found';



let root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <HashRouter>
      <Switch>

      <Route exact path="/" component={Comp.Home} />     
      <Route exact path="/register" component={Register.Register} />
      <Route exact path="/login" component={Login.Login} />
      <Route exact path="/popular" component={Comp.PopularPage} />     
      <Route exact path="/about" component={Comp.About} /> 
      <Route exact path="/howto" component={Comp.HowTo} /> 
      <Route exact path="/search/:searchQuery" component={Comp.SearchPage} />
      <Route exact path="/series/:series_id" component={Series.SeriesList} />
      <Route exact path="/series/:series_id/new" component={Angel.AngelNew} />
      <Route exact path="/userprofile/edit" component={User.UserSettings} />
      <Route exact path="/userprofile" component={User.UserProfile} />
      <Route exact path="/user/:user_id" component={User.UserPage} />
      <Route exact path="/angels/:angel_id" component={Angel.AngelDetails} />
      <Route exact path="/angels/:angel_id/edit" component={Angel.AngelEdit} />
      <Route exact path="/angels/:angel_id/history" component={Angel.AngelHistory} />
      <Route exact path="/masterlist" component={Angel.MasterList} />
      <Route exact path="/posts" component={Post.PostList} />
      <Route exact path="/posts/new" component={Post.PostNew} />
      <Route exact path="/posts/:post_id(\d+)" component={Post.PostDetails} />
      <Route exact path="/posts/:post_id(\d+)/edit" component={Post.PostEdit} />

      <Route component={NotFound} /> {/* This will catch all undefined routes */}
      </Switch>
    </HashRouter>
  );



