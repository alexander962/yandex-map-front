import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../../index";
import { observer } from "mobx-react-lite";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { Header } from "../header/Header";
import backVideo from "../../video/back-video.mp4";
import view from "../../images/view.svg";
import noView from "../../images/invisible.svg";
import "./Registration.scss";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Registration = () => {
  let history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [severity, setSeverity] = useState("error");
  const errors = [];
  let validEmail = false;
  let validPassword = false;
  let validRepeatPassword = false;
  const { store } = useContext(Context);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const addNewUser = async () => {
    await store.registration(email, password);
    if (localStorage.getItem("token")) {
      history.push("/map");
    } else {
      setMessage("Пользователь с таким email уже существует");
      setOpen(true);
    }
  };

  const onClickRegisterBtn = (e) => {
    if (email === "" || password === "" || repeatPassword === "") {
      errors.push("Заполните все поля! ");
      setMessage("Заполните все поля!");
      setOpen(true);
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      errors.push(`Введите корректный email, например: example@gmail.com! `);
      setMessage(errors);
      setOpen(true);
    } else {
      validEmail = true;
    }
    if (!/(?=.*[0-9])(?=.*[A-Za-z]){5,}/.test(password)) {
      errors.push(
        "Введите в поле password не менее 6 латинских символов, минимум 1 из которых является числом! "
      );
      setMessage(errors);
      setOpen(true);
    } else {
      validPassword = true;
    }
    if (password !== repeatPassword) {
      errors.push("Пароли не совпадают!");
      setMessage(errors);
      setOpen(true);
    } else {
      validRepeatPassword = true;
    }
    if (validEmail && validPassword && validRepeatPassword) {
      addNewUser();
      setEmail("");
      setPassword("");
      setRepeatPassword("");
    }
  };

  function show_hide_password() {
    let input = document.getElementById("password");
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

  function show_hide_password_repeat() {
    let input = document.getElementById("password-repeat");
    let linkA = document.getElementsByClassName("password-control_repeat")[0];
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
      <Header heading="Зарегистрироваться в системе" />
      <div className="content-block">
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",
          }}
        >
          <source src={backVideo} type="video/mp4" />
        </video>
        <p className="content-block_text">
          Подробная карта России и мира, на которой отмечено всё на свете: от
          ресторанов и музеев до парков и аптек. На сервисе есть фотографии
          организаций и информация о них: телефоны, адреса сайтов, часы работы и
          т. д. Карты умеют строить автомобильные и пешие маршруты, а также
          маршруты на общественном транспорте. Приложение Яндекс.Карты для
          смартфонов может работать без интернета.
        </p>
        <div className="Registration-form">
          <p>Регистрация</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="login"> Login: </label>
            <input
              type="text"
              id="login"
              value={email}
              placeholder="Login"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password"> Password: </label>
            <div className="password-block">
              <input
                type="password"
                id="password"
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
            <label htmlFor="password"> Repeat password: </label>
            <div className="password-block">
              <input
                type="password"
                id="password-repeat"
                placeholder="Password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <img
                src={noView}
                className="password-control_repeat"
                onClick={() => show_hide_password_repeat()}
                alt="noView"
              />
            </div>
            <div className="send-block">
              <input
                type="submit"
                value="Зарегистрироваться"
                id="form-btnr"
                onClick={(e) => onClickRegisterBtn(e)}
              />
              <Link to="/autorization">Авторизоваться</Link>
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

export default observer(Registration);
