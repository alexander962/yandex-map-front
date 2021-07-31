import $api from "../http";

export default class CoordinationsService {
  static async getAllCoordinates(userId) {
    return $api.get(`/getAllCoordinates?userIdBody=${userId}`);
  }

  static async createNewCoordinates(name, longitude, latitude, userId, metka) {
    return $api.post("/createCoordinates", {
      name: name,
      longitude: longitude,
      latitude: latitude,
      userId: userId,
      metka: metka
    });
  }

  static async editCoordinate(editParams, userId) {
    return $api.patch("/editCoordinates", {
      _id: editParams.item._id,
      name: editParams.nameEdit,
      longitude: editParams.longitudeEdit,
      latitude: editParams.latitudeEdit,
      userId: userId,
    });
  }

  static async deleteCoordinates(id) {
    return $api.delete("/deleteCoordinates", {
      data: { id: id },
    });
  }
}
