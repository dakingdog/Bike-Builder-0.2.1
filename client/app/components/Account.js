import React from 'react';
import {updateAccount,getUserData} from '../server.js';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
      first_name: "",
      last_name: "",
      password: "",
      user_name: "",
      email:""
    };
}

  /*
  Refresh should be called after a client event is handled by the server if
  any persistent state needs to be synced
  */

  refresh(){
    getUserData(this.props.user, (userInfo) =>{
      this.setState({
        user_id: userInfo._id,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        password: userInfo.password,
        user_name: userInfo.user_name,
        email: userInfo.email
      });
    });
  }

  componentDidMount(){
    this.refresh();
  }

//
//   handleChangefName(event){
//     event.preventDefault();
//     if(event.button === 0){
//       var name = document.getElementById("first name").value;
//       changeFirstName(this.state.user_id, name);
//       this.setState({first_name: name});
//     }
//       this.refresh();
//   }
//
//   handleChangelName(event){
//     event.preventDefault();
//     if(event.button === 0 ){
//     var lname = document.getElementById("last name").value;
//     alert(this.state.last_name);
//     this.setState({last_name: lname});
//     }
//   }
//   handleChangeEmail(event){
//     event.preventDefault();
//     if(event.button === 0 ){
//     var email = document.getElementById("email").value;
//     this.setState({email: email});
//   }
// }
//   handleChangeUserName(event){
//     event.preventDefault();
//     if(event.button === 0 ){
//       var user_name = document.getElementById("user name").value;
//     this.setState({user_name: user_name})
//   }
// }
//   handleChangePassword(event){
//     event.preventDefault();
//     if(event.button === 0 ){
//         var password = document.getElementById("password").value;
//     this.setState({password: password});
//   }
// }

handleUpdate(event){
  event.preventDefault();
  if(event.button === 0 ){
    var name = document.getElementById("first name").value;
    var lname = document.getElementById("last name").value;
    var newemail = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var newpassword = document.getElementById("password").value;
    updateAccount(this.state.user_id, name,lname,newemail,username,newpassword)
  this.setState({
    first_name: name,
    last_name: lname,
    email: newemail,
    user_name: username,
    password: newpassword
  });
  alert("Account is being updated.")
  this.refresh();
}
}

  handleClickEvent(clickEvent){
    clickEvent.preventDefault();
    this.refresh();

  }



  // handleClickEvent(clickEvent,userId,first_name,last_name,email,password,user_name,cb){
  //   clickEvent.preventDefault();
  //   if(clickEvent.button === 0){
  //
  //     changeFirstName(userId,first_name,cb);
  //     this.refresh();
  //   }
  // }

  // handleUpdateBtnClickEvent(clickEvent){
  //   clickEvent.preventDefault();
  //   if(clickEvent.button === 0){
  //
  //     var callbackFunction = (userdata) =>{
  //       // updateAccount(userId, newfName, newlName, newemail, newuName, newPassword);
  //       this.setState({
  //         first_name : userdata.newFirstName,
  //         last_name: userdata.newLastName,
  //         email: userdata.newEmail,
  //         user_name: userdata.newUserName,
  //         password: userdata.newPassword
  //       });
  //     }
  //       // updateAccount(userId, newfName, newlName, newemail, newuName, newPassword,callbackFunction);
  //       callbackFunction();
  //     this.refresh();
  //   }
  // }
  // updateListener(){
  //   alert(this.first_name);
  // }


  render() {


    return (
      <div className="body-container">
        <div className="col-md-2">
        </div>
        <div className="col-md-8 text-align-left">
          <div className="panel panel-default">
            <div className="form-group">
              <br></br>
            <label className="control-label " htmlFor="first name" >First Name</label>
              <input type="text" className="form-control" id="first name" value = {this.state.first_name}/>
              <br>
              </br>
              <div className="form-group">
                <label className="control-label " htmlFor="last name" >Last Name</label>
                  <input type="text" className="form-control" id="last name" value = {this.state.last_name}/>
                </div>
                </div>
              <div className="form-group">
                <label className="control-label " htmlFor="email">Email</label>
                  <input type="email" className="form-control" id="email" value= {this.state.email} />
                  </div>

                  <div className="form-group">
                    <label className="control-label " htmlFor="username" > Username</label>
                      <input type="email" className="form-control" id="username" value= {this.state.user_name} />
                      </div>

                        <div className="form-group">
                        <label className="control-label " htmlFor="password" > Password</label>
                          <input type="text" className="form-control" id="password" value = {this.state.password}/>
                        </div>
                        <button type ="button"
                          onClick ={(e) => this.handleUpdate(e)} >Update</button>
            </div>
          </div>
        </div>

              );
            }
          }
