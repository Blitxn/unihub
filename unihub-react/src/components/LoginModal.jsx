import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../login.css';

function LoginModal({ open, onClose, onLoginSuccess, pendingPath }) {

  const [modalView, setModalView] = useState('login');

  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');

  const navigate = useNavigate();


  if (!open) return null;


  const handleClose = () => {
    setModalView('login');

    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');

    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirm('');
    setSignupError('');

    onClose();
  };


  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {

      const res = await api.post('/api/users/login', {
        email: loginEmail,
        password: loginPassword,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      onLoginSuccess();
      handleClose();


      if(res.data.user.role === "admin"){
        navigate('/admin');
      }
      else{
        navigate(pendingPath || '/search');
      }


    } catch(err){

      setLoginError(
        err.response?.data?.message ||
        "Invalid email or password."
      );

    }
  };



  // REGISTER
  const handleSignupSubmit = async (e) => {
  e.preventDefault();
  setSignupError('');

  if (signupPassword !== signupConfirm) {
    setSignupError("Passwords do not match.");
    return;
  }

  try {
    const res = await api.post('/api/users/register', {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      role: 'student'
    });

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    onLoginSuccess();
    handleClose();
  } catch (err) {
    console.log('REGISTER ERROR:', err);
    console.log('SERVER RESPONSE:', err.response?.data);

    setSignupError(
      err.response?.data?.message ||
      'Registration failed.'
    );
  }
};




  return (

    <div className="modal-overlay" onClick={handleClose}>


      <div 
        className="card"
        onClick={(e)=>e.stopPropagation()}
      >


        <button 
          className="modal-close-btn"
          onClick={handleClose}
        >
          &times;
        </button>



        <div className="panel-left">


          <div className="panel-left__top">

            <h1 className="brand-title">
              Welcome to
              <br/>
              Unihub
            </h1>


            <p className="brand-tagline">

              {
                modalView === 'login'
                ?
                "Discover university. Shape your goal."
                :
                "Join our community. Track your educational pathway."
              }

            </p>

          </div>



          <div className="bear-wrap">

            <img
              src="/bear.png"
              alt="Unihub mascot bear"
              className="bear-img"
            />

          </div>




          <p className="signup-prompt">


          {
            modalView === "login"

            ?

            <>
            Don't have an account?{" "}

            <a
            href="#signup"
            onClick={(e)=>{
              e.preventDefault();
              setModalView("signup");
            }}
            >
              Create one
            </a>

            </>


            :


            <>

            Already have an account?{" "}

            <a
            href="#login"
            onClick={(e)=>{
              e.preventDefault();
              setModalView("login");
            }}
            >
              Sign In
            </a>

            </>


          }


          </p>


        </div>





        <div className="panel-right">



        {
        modalView === "login"

        ?

        <form 
        className="form-wrap animate-fade"
        onSubmit={handleLoginSubmit}
        >


        <h2 className="form-title">
          Welcome Back!
        </h2>


        <p className="form-subtitle">
          Continue your path to academic success.
        </p>



        <div className="field">

        <label>
          Email
        </label>


        <input

        type="email"

        placeholder="Enter your email address"

        required

        value={loginEmail}

        onChange={(e)=>setLoginEmail(e.target.value)}

        />

        </div>





        <div className="field">

        <label>
          Password
        </label>


        <input

        type="password"

        placeholder="Enter your password"

        required

        value={loginPassword}

        onChange={(e)=>setLoginPassword(e.target.value)}

        />


        </div>





        {
        loginError &&

        <p className="error">
          {loginError}
        </p>
        }




        <button 
        type="submit"
        className="btn-login"
        >
          Login
        </button>



        </form>



        :



        <form

        className="form-wrap animate-fade"

        onSubmit={handleSignupSubmit}

        >



        <h2 className="form-title">
          Create Account
        </h2>



        <p className="form-subtitle">
          Start your higher education search journey.
        </p>





        <div className="field">

        <label>
          Full Name
        </label>


        <input

        type="text"

        placeholder="Enter your full name"

        required

        value={signupName}

        onChange={(e)=>setSignupName(e.target.value)}

        />


        </div>





        <div className="field">

        <label>
          Email
        </label>


        <input

        type="email"

        placeholder="Enter your email"

        required

        value={signupEmail}

        onChange={(e)=>setSignupEmail(e.target.value)}

        />


        </div>





        <div className="field">

        <label>
          Password
        </label>


        <input

        type="password"

        placeholder="Create password"

        required

        value={signupPassword}

        onChange={(e)=>setSignupPassword(e.target.value)}

        />


        </div>





        <div className="field">

        <label>
          Confirm Password
        </label>


        <input

        type="password"

        placeholder="Repeat password"

        required

        value={signupConfirm}

        onChange={(e)=>setSignupConfirm(e.target.value)}

        />


        </div>





        {
        signupError &&

        <p className="error">
          {signupError}
        </p>
        }




        <button

        type="submit"

        className="btn-login"

        >

        Sign Up

        </button>



        </form>


        }



        </div>


      </div>


    </div>


  );

}
export default LoginModal;