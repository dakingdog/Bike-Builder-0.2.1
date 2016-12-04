import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home';
import Build from './components/Build';
import Account from './components/Account';
import SavedBuilds from './components/SavedBuilds'
import NavBar from './components/navbar'
import Footer from './components/footer'
import {readDocument} from './database';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

class App extends React.Component {
  render() {
    return (<div>
              <NavBar user={1} page = {this.props.location.pathname}/>
              { this.props.children }
              <Footer />
            </div>)
  }
}

class SavedBuildsWrapper extends React.Component {
  render(){
    var user = readDocument("users", 1);
    return(<div>
              <NavBar user={1} page = {this.props.location.pathname}/>
              <SavedBuilds user={1} builds = {user.buildList} />
              <Footer />
            </div>)
  }
}

class AccountWrapper extends React.Component{
  render() {
    return (<div>
      <NavBar user={1} page={this.props.location.pathname} />
      <Account user={1} />
      <Footer />
      </div>
    );
  }
}

class BuildWrapper extends React.Component{
  constructor(props){
    super(props);
    console.log("Build wrapper id: " + this.props.params.id);
  }

  render() {

    if (isNaN(this.props.params.id)){  //if id not number, its not coming from a saved build
      return(
        <div>
        <NavBar user={1} page={this.props.location.pathname} />
        <Build user={1} state={0}/>
        <Footer />
        </div>
      );
    }
    else { //if we are passing an id, it must be a saved build
      return(
        <div>
        <NavBar user={1} page={this.props.location.pathname} />
        <Build user={1} state={1} buildId={this.props.params.id} />
        <Footer />
        </div>
      );
    }
  }
}
ReactDOM.render((
  <Router history={ browserHistory }>
    <Route
           path="/"
           component={ App }>
      { /* Show the Feed at / */ }
      <IndexRoute component={ Home } />

      </Route>
    <Route
             path="build/:id"
             component={ BuildWrapper } />

   <Route
            path="build/new"
            component={ BuildWrapper } />
    <Route
           path="savedbuilds/:id"
           component={ SavedBuildsWrapper } />

    <Route
           path="account/:id"
           component={ AccountWrapper } />
  </Router>
  ),
  document.getElementById('bikePage'));
