import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  YMaps,
  Map,
  GeolocationControl,
  GeoObject,
} from "react-yandex-maps";
import { TextField } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import editImg from "../../images/pencil.svg";
import deleteImg from "../../images/delete.svg";
import "./YandexMap.scss";
import { DeleteModal } from "../DeleteModal/DeleteModal";
import { EditModal } from "../EditeModal/EditeModal";
import axios from "axios";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const YandexMap = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitudeCenter, setLongitudeCenter] = useState('');
  const [latitudeCenter, setLatitudeCenter] = useState('');
  const [deleteMod, setDeleteMod] = useState(false);
  const [editMod, setEditMod] = useState(false);
  const [coordinations, setCoordinations] = useState([]);
  const [open, setOpen] = useState(false);
  const [idDel, setIdDelete] = useState("");
  const [itemEdit, setItemEdit] = useState("");
  const userIdBody = JSON.parse(localStorage.getItem("user"));

  useEffect(() => getAllCoordinations(userIdBody), []);

  const getAllCoordinations = async (userId) => {
    console.log(userId);
    try {
      await axios
        .get(`http://localhost:8000/getAllCoordinates?userIdBody=${userId}`)
        .then((results) => {
          console.log(results.data.data);
          setCoordinations(results.data.data);
        });
    } catch (e) {
      setOpen(true);
    }
  };

  const createNewCoordinates = async (
    name,
    longitude,
    latitude,
    userIdBody
  ) => {
    await axios.post("http://localhost:8000/createCoordinates", {
      name: name,
      longitude: longitude,
      latitude: latitude,
      userId: userIdBody,
    });
    getAllCoordinations(userIdBody);
    setName("");
    setLongitude("");
    setLatitude("");
  };

  const editCoordinates = async (editParams) => {
    await axios
      .patch("http://localhost:8000/editCoordinates", {
        _id: editParams.item._id,
        name: editParams.nameEdit,
        longitude: editParams.longitudeEdit,
        latitude: editParams.latitudeEdit,
        userId: userIdBody,
      })
      .then((res) => {
        setCoordinations(res.data.data);
      });
    getAllCoordinations(userIdBody);
  };

  const deleteCoordinates = async (id) => {
    await axios
      .delete("http://localhost:8000/deleteCoordinates", {
        data: { id: id },
      })
      .then((res) => {
        setCoordinations(res.data.data);
      });
    getAllCoordinations(userIdBody);
  };

  const getGeoLocation = (ymaps) => {
    console.log(ymaps);
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
    console.log(location);
    const loc = location[0] + " " + location[1];
    console.log(loc);
    ymaps.geocode(loc).then((result) => {
      const longitude = {coordinates: result.geoObjects.get(0).geometry.getCoordinates()[0]}
      const latitude = {coordinates: result.geoObjects.get(0).geometry.getCoordinates()[1]}
      handleClickMap(longitude.coordinates, latitude.coordinates);
    }
    );
  };

  const handleApiAvaliable = (ymaps) => {
    getGeoLocation(ymaps);
  };

  const handleOutBtn = () => {
    localStorage.clear();
    history.push("/autorization");
  };

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

  return (
    <YMaps
      query={{
        ns: "ymaps",
        apikey: "1e259de4-7ea3-43d8-8ab5-613ee704fc89",
        load: "package.full",
      }}
      modules={["geolocation", "geocode"]}
    >
      <Map
        onLoad={(ymaps) => handleApiAvaliable(ymaps)}
        modules={["geolocation", "geocode"]}
        state={{
          center: [longitudeCenter, latitudeCenter],
          zoom: 9,
        }}
        style={{ width: "100vw", height: "100vh" }}
        options={{
          autoFitToViewport: "always",
        }}
      >
        <GeolocationControl options={{ float: "left" }} />
        {coordinations.length > 0 &&
          coordinations.map((item) => {
            return (
              <GeoObject
                geometry={{
                  type: "Point",
                  coordinates: [item.longitude, item.latitude],
                }}
                modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                properties={{
                  balloonContent: item.name,
                }}
                onClick={() => handleClickMap(item.longitude, item.latitude)}
              />
            );
          })}
      </Map>
      <button onClick={() => handleOutBtn()} className="outBtn">
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
          <button
            className="addBtn"
            onClick={() =>
              createNewCoordinates(name, longitude, latitude, userIdBody)
            }
          >
            Добавить
          </button>
        </div>

        <div className="YandexMap-list">
          {coordinations.length > 0 &&
            coordinations.map((item) => {
              return (
                <div
                  className="YandexMap-list_item"
                  key={item._id}
                  onClick={() => handleClickMap(item.longitude, item.latitude)}
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