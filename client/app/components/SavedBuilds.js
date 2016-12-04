import React from 'react';
import Router from 'react-router';
import {getUserData, getBuilds} from '../server';
export default class SavedBuilds extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      builds: [],
      contents: []
      // current_state: 0
    };
    getBuilds(this.props.user, (build)=>{
      this.setState({
        builds: build
      });
    });
  }

  refresh() {
    getUserData(this.props.user, (userData) => {
      this.setState(userData);
    });

  }

  componentDidMount() {
    this.refresh();
  }

  populateTable(){

    var rows = [];
    for(let i = 0; i < Object.keys(this.state.builds).length; i++){
      var build = this.state.builds[i];
      rows.push(<tr key={i} onClick ={(e) => {
        this.handleClick(e, i + 1)}}>
          <td>{build.contents.build_name}</td>
          <td>{build.contents.total_price}</td>
          <td>{build.contents.bike_type}</td>
          <td>{build.contents.status}</td>
      </tr>);
    }
    return rows;
  }

  handleClick(clickEvent, id){
    clickEvent.preventDefault();
    if(clickEvent.button === 0){
      console.log("going to build : " + id);
      this.context.history.pushState(null, 'Build/' + id);
    }
  }
  render() {

    return (
      <div className="body-container">
        <div className="col-md-2">
        </div>
        <div className="col-md-8 text-center">
          <div className="panel panel-default">
            <table className="table table-hover table-bordered">
                <caption>My Favorite Builds</caption>
                <thead>
                    <tr>
                        <th>Build Name</th>
                        <th>Price</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody data-link="row" className="rowlink">
                {this.populateTable()}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-2">
          </div>
        </div>
      );
  }
}

SavedBuilds.contextTypes = {
  history: React.PropTypes.object.isRequired
};
