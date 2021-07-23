import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Header } from "../header/Header";
import view from "../../images/view.svg";
import noView from "../../images/invisible.svg";
import "./Authorization.scss";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Authorization = () => {
  // let history = useHistory();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [severity, setSeverity] = useState("error");
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

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
    try {
      await axios
        .post("http://localhost:8000/checkUser", {
          login: login,
          password: password,
        })
        .then((res) => {
          console.log(res.data.data._id);
          setSeverity("success");
          setMessage("Вы удачно авторизованы");
          setOpen(true);
          localStorage.setItem("user", JSON.stringify(res.data.data._id));
          history.push("./map");
        });
    } catch (e) {
      setSeverity("error");
      setMessage("Вы ввели неверный логин или пароль");
      setOpen(true);
    }
  };

  const onClickSignInBtn = (e) => {
    if (login === "" || password === "") {
      setMessage("Заполните все поля!");
      setOpen(true);
    } else if (login.length < 6) {
      setMessage("Минимальное колличество символов для Login = 6");
      setOpen(true);
    } else if (!/(?=.*[0-9])(?=.*[A-Za-z]){5,}/.test(password)) {
      setMessage(
        "Введите в поле password не менее 6 латинских символов, минимум 1 из которых является числом"
      );
      setOpen(true);
    } else {
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
              value={login}
              placeholder="Login"
              onChange={(e) => setLogin(e.target.value)}
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
