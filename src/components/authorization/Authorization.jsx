import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../../index";
import axios from "axios";
import { observer } from "mobx-react-lite";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Header } from "../header/Header";
import view from "../../images/view.svg";
import noView from "../../images/invisible.svg";
import "./Authorization.scss";
import $api from "../../http/index";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Authorization = () => {
  // let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [severity, setSeverity] = useState("error");
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const errors = [];
  let validEmail = false
  let validPassword = false
  const { store } = useContext(Context);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const signInCheck = async () => {
    await store.login(email, password);
    if ( localStorage.getItem("token")) {
      history.push('/map')
    } else {
      setMessage("Пользователь с таким email не найден");
      setOpen(true);
    }
  };

  const onClickSignInBtn = (e) => {
    if (email === "" || password === "") {
      errors.push(`Заполните все поля! `);
      setMessage("Заполните все поля!");
      setOpen(true);
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      errors.push(`Введите корректный email, например: example@gmail.com! `);
      setMessage(errors);
      setOpen(true);
    } else {
      validEmail = true;
    }
    if (!/(?=.*[0-9])(?=.*[A-Za-z]){5,}/.test(password)) {
      errors.push("Введите в поле password не менее 6 латинских символов, минимум 1 из которых является числом");
      setMessage(
        errors
      );
      setOpen(true);
    } else {
      validPassword = true
    } 
    if (validEmail && validPassword) {
      signInCheck();
    }
  };

  function show_hide_password() {
    let input = document.getElementById("passwordSingIn");
    let linkA = document.getElementsByClassName("password-control")[0];
    if (input.getAttribute("type") === "password") {
      linkA.src = view;
      input.setAttribute("type", "text");
    } else {
      linkA.src = noView;
      input.setAttribute("type", "password");
    }
    return false;
  }

  return (
    <div>
      <Header heading="Войти в систему" />
      <div className="content-block">
        <p className="content-block_text">
          Подробная карта России и мира, на которой отмечено всё на свете: от
          ресторанов и музеев до парков и аптек. На сервисе есть фотографии
          организаций и информация о них: телефоны, адреса сайтов, часы работы и
          т. д. Карты умеют строить автомобильные и пешие маршруты, а также
          маршруты на общественном транспорте. Приложение Яндекс.Карты для
          смартфонов может работать без интернета.
        </p>
        <div className="SignIn-form">
          <p>Войти в систему</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="loginSignIn"> Login: </label>
            <input
              type="text"
              id="loginSignIn"
              value={email}
              placeholder="Login"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="passwordSignIn"> Password: </label>
            <div className="password-block">
              <input
                type="password"
                id="passwordSingIn"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={noView}
                className="password-control"
                onClick={() => show_hide_password()}
                alt="noView"
              />
            </div>
            <div className="send-block">
              <input
                type="submit"
                value="Войти"
                id="form-btn_s"
                onClick={(e) => onClickSignInBtn(e)}
              />
              <Link to="/registration">Зарегистрироваться</Link>
            </div>
          </form>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default observer(Authorization);
