import React, { useEffect, useState, useContext } from "react";
import { Context } from "../../index";
import { useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  YMaps,
  Map,
  GeolocationControl,
  Placemark,
} from "react-yandex-maps";
import { TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import editImg from "../../images/pencil.svg";
import deleteImg from "../../images/delete.svg";
import "./YandexMap.scss";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import { EditModal } from "../EditeModal/EditeModal";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const YandexMap = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitudeCenter, setLongitudeCenter] = useState("");
  const [latitudeCenter, setLatitudeCenter] = useState("");
  const [deleteMod, setDeleteMod] = useState(false);
  const [editMod, setEditMod] = useState(false);
  const [coordinations, setCoordinations] = useState([]);
  const [open, setOpen] = useState(false);
  const [idDel, setIdDelete] = useState("");
  const [itemEdit, setItemEdit] = useState("");
  const userIdBody = localStorage.getItem("user");
  const { store } = useContext(Context);
  // Работа с меткой
  const [metka, setMetka] = useState();
  const [valueRadio, setValueRadio] = useState("1");
  const [urlMetka, setUrlMetka] = useState();
  const metkaBlack = "https://image.flaticon.com/icons/png/512/484/484167.png";
  const metkaRed = "https://image.flaticon.com/icons/png/512/684/684908.png";
  // Активация аккаунта
  const isActivated = JSON.parse(localStorage.getItem("isActivated"));
  console.log(typeof(isActivated))

  const changeHandler = async (event) => {
    await setValueRadio(event.target.value);
    if (event.target.value !== '4') {
      setUrlMetka('');
    }
  };

  useEffect(() => getAllCoordinations(userIdBody), []);

  const getAllCoordinations = async (userId) => {
    try {
      await store.getAllCoordinates(userId);
      setCoordinations(store.coordinates);
    } catch (e) {
      setOpen(true);
    }
  };

  const createNewCoordinates = async (
    name,
    longitude,
    latitude,
    userIdBody,
    metka
  ) => {
    if (isActivated) {
      await store.createNewCoordinates(
        name,
        longitude,
        latitude,
        userIdBody,
        metka
      );
      getAllCoordinations(userIdBody);
      setName("");
      setLongitude("");
      setLatitude("");
    } else {
      alert("Чтобы добавить метку, пожалуста, перейдите на свою почту и активируйте свой аккаут!")
    }
  };

  const editCoordinates = async (editParams) => {
    const userId = localStorage.getItem("user");
    await store.editCoordinate(editParams, userId);
    setCoordinations(store.coordinates);
    getAllCoordinations(userIdBody);
  };

  const deleteCoordinates = async (id) => {
    await store.deleteCoordinates(id);
    setCoordinations(store.coordinates);
    getAllCoordinations(userIdBody);
  };

  const getGeoLocation = (ymaps) => {
    return ymaps.geolocation
      .get({
        provider: "browser",
        mapStateAutoApply: true,
      })
      .then((result) =>
        ymaps.geocode(result.geoObjects.position).then((res) => {
          let firstGeoObject = res.geoObjects.get(0);
          getGeocode(ymaps, firstGeoObject.getAdministrativeAreas());
        })
      );
  };

  const getGeocode = (ymaps, location) => {
    const loc = location[0] + " " + location[1];
    ymaps.geocode(loc).then((result) => {
      const longitude = {
        coordinates: result.geoObjects.get(0).geometry.getCoordinates()[0],
      };
      const latitude = {
        coordinates: result.geoObjects.get(0).geometry.getCoordinates()[1],
      };
      handleClickMap(longitude.coordinates, latitude.coordinates);
    });
  };

  const handleApiAvaliable = (ymaps) => {
    getGeoLocation(ymaps);
  };

  const logout = async () => {
    await store.logout().then((res) => {
      history.push("/autorization");
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  const handleDelete = (id) => {
    setDeleteMod(true);
    setIdDelete(id);
  };

  const handleEdit = (item) => {
    setEditMod(true);
    setItemEdit(item);
  };

  const onEditRow = (editParams) => {
    editCoordinates(editParams);
    setEditMod(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClickMap = (long, latit) => {
    setLongitudeCenter(long);
    setLatitudeCenter(latit);
  };

  const handleUrlMarker = (value) => {
    setUrlMetka(value);
    setMetka(value);
  };

  return (
    <YMaps
      query={{
        ns: "ymaps",
        apikey: "1e259de4-7ea3-43d8-8ab5-613ee704fc89",
        load: "package.full",
      }}
      modules={[
        "geolocation",
        "geocode",
        "layout.ImageWithContent",
        "templateLayoutFactory",
      ]}
    >
      <Map
        onLoad={(ymaps) => handleApiAvaliable(ymaps)}
        modules={[
          "geolocation",
          "geocode",
          "layout.ImageWithContent",
          "templateLayoutFactory",
        ]}
        state={{
          center: [longitudeCenter, latitudeCenter],
          zoom: 9,
          controls: [],
        }}
        style={{ width: "100vw", height: "100vh" }}
        options={{
          autoFitToViewport: "always",
        }}
      >
        <GeolocationControl options={{ float: "left" }} />
        {coordinations.length > 0 &&
          coordinations.map((item, index) => {
            if (item.metka === "Standart") {
              return (
                <Placemark
                  key={`placemark${index}`}
                  geometry={{
                    type: "Point",
                    coordinates: [item.longitude, item.latitude],
                  }}
                  // options={{
                  //   iconLayout: "default#image",
                  //   iconImageSize: [50, 50],
                  //   iconImageHref: item.metka
                  // }}
                  modules={[
                    "geoObject.addon.balloon",
                    "geoObject.addon.hint",
                    "layout.ImageWithContent",
                  ]}
                  properties={{
                    balloonContent: item.name,
                  }}
                  onClick={() => handleClickMap(item.longitude, item.latitude)}
                />
              );
            } else {
              return (
                <Placemark
                  key={`placemark${index}`}
                  geometry={{
                    type: "Point",
                    coordinates: [item.longitude, item.latitude],
                  }}
                  options={{
                    iconLayout: "default#image",
                    iconImageSize: [50, 50],
                    iconImageHref: item.metka,
                  }}
                  modules={[
                    "geoObject.addon.balloon",
                    "geoObject.addon.hint",
                    "layout.ImageWithContent",
                  ]}
                  properties={{
                    balloonContent: item.name,
                    iconCaption: "asd",
                  }}
                  onClick={() => handleClickMap(item.longitude, item.latitude)}
                />
              );
            }
          })}
      </Map>
      <button onClick={() => logout()} className="outBtn">
        Выход
      </button>
      <div className="YandexMap_main">
        <div className="YandexMap_forms">
          <p>Название</p>
          <TextField
            type="text"
            id="nameInput"
            value={name}
            variant="outlined"
            onChange={(e) => setName(e.target.value)}
          />

          <p>Долгота</p>
          <TextField
            type="number"
            id="nameInput"
            value={longitude}
            variant="outlined"
            onChange={(e) => setLongitude(e.target.value)}
          />

          <p>Широта</p>
          <TextField
            type="number"
            id="nameInput"
            value={latitude}
            variant="outlined"
            onChange={(e) => setLatitude(e.target.value)}
          />

          <p>Выберете маркер:</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="markerChoice1"
                name="marker"
                value="1"
                onClick={() => setMetka("Standart")}
                checked={valueRadio === "1" ? true : false}
                onChange={changeHandler}
                style={{ cursor: "pointer" }}
              />
              <label
                for="markerChoice1"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              >
                Стандарт
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="markerChoice2"
                name="marker"
                value="2"
                onClick={() => setMetka(metkaBlack)}
                checked={valueRadio === "2" ? true : false}
                onChange={changeHandler}
                style={{ cursor: "pointer" }}
              />
              <label for="markerChoice2" style={{ cursor: "pointer" }}>
                <img
                  src="https://image.flaticon.com/icons/png/512/484/484167.png"
                  alt="Чёрная"
                  style={{ width: "25px", height: "25px" }}
                />
              </label>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="markerChoice3"
                name="marker"
                value="3"
                onClick={() => setMetka(metkaRed)}
                checked={valueRadio === "3" ? true : false}
                onChange={changeHandler}
                style={{ cursor: "pointer" }}
              />
              <label for="markerChoice3" style={{ cursor: "pointer" }}>
                <img
                  src="https://image.flaticon.com/icons/png/512/684/684908.png"
                  alt="Чёрная"
                  style={{ width: "25px", height: "25px" }}
                />
              </label>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                id="markerChoice4"
                name="marker"
                value="4"
                checked={valueRadio === "4" ? true : false}
                onChange={changeHandler}
                style={{ cursor: "pointer" }}
              />
              <label
                for="markerChoice4"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              >
                Загрузить маркер по url:
              </label>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent:'space-between'}}>
              {valueRadio === "4" && (
                <input
                  type="text"
                  id="nameInput"
                  value={urlMetka}
                  variant="outlined"
                  onChange={(e) => handleUrlMarker(e.target.value)}
                />
              )}
              {urlMetka && (
                <img
                  src={urlMetka}
                  alt="Ваша метка"
                  style={{ width: "35px", height: "35px" }}
                />
              )}
            </div>
          </div>

          <button
            className="addBtn"
            onClick={() =>
              createNewCoordinates(name, longitude, latitude, userIdBody, metka)
            }
          >
            Добавить
          </button>
        </div>

        <div className="YandexMap-list">
          {coordinations.length > 0 &&
            coordinations.map((item) => {
              return (
                <>
                  <div
                    className="YandexMap-list_item"
                    key={item._id}
                    onClick={() =>
                      handleClickMap(item.longitude, item.latitude)
                    }
                  >
                    <p>Название: {item.name}</p>
                    <p>Долгота: {item.longitude}</p>
                    <p>Широта: {item.latitude}</p>
                    <img
                      src={editImg}
                      className="tableImg"
                      alt="edit"
                      onClick={() => handleEdit(item)}
                    />
                    <img
                      src={deleteImg}
                      className="tableImg"
                      alt="delete"
                      onClick={() => handleDelete(item._id)}
                    />
                    {deleteMod && (
                      <DeleteModal
                        idDel={idDel}
                        deleteEl={deleteCoordinates}
                        setDeleteMod={setDeleteMod}
                        deleteMod={deleteMod}
                      />
                    )}
                    {editMod ? (
                      <EditModal
                        itemEdit={itemEdit}
                        editEl={onEditRow}
                        setEditMod={setEditMod}
                        editMod={editMod}
                      />
                    ) : (
                      <div />
                    )}
                  </div>
                  <br />
                </>
              );
            })}
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          "Ошибка соединения с сервером"
        </Alert>
      </Snackbar>
    </YMaps>
  );
};

export default observer(YandexMap);
