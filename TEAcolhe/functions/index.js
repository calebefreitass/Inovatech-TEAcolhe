const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue, GeoPoint } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// --- FUNÇÃO AUXILIAR: Calcular distância ---
// Fórmula de Haversine
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// -------------------------------------------

exports.updateLocationFromTag = onRequest(
  { region: "southamerica-east1" },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { tagId, latitude, longitude } = req.body;

    if (!tagId || latitude === undefined || longitude === undefined) {
      return res
        .status(400)
        .send("Missing data: tagId, latitude, or longitude");
    }

    try {
      // 1. Achar usuário da tag
      const q = db.collection("users").where("tagId", "==", tagId).limit(1);
      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        console.warn("Tag desconhecida:", tagId);
        return res.status(404).send("Tag ID not found");
      }

      const userId = querySnapshot.docs[0].id;

      // 2. Salvar nova localização
      await db.collection("locations").doc(userId).set({
        latitude,
        longitude,
        timestamp: FieldValue.serverTimestamp(),
      });

      // 3. Verificar geofence
      const geofenceDoc = await db.collection("geofences").doc(userId).get();

      if (geofenceDoc.exists) {
        const fence = geofenceDoc.data();
        const centerLat = fence.center.latitude;
        const centerLng = fence.center.longitude;
        const radius = fence.radius;

        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          centerLat,
          centerLng
        );

        console.log(
          `Distância: ${distance.toFixed(2)}m | Raio: ${radius}m`
        );

        if (distance > radius) {
          console.warn(`ALERTA: Usuário ${userId} saiu da área segura!`);

          await db.collection("alerts").add({
            userId,
            type: "GEOFENCE_EXIT",
            message: "O usuário saiu da área segura!",
            timestamp: FieldValue.serverTimestamp(),
            location: { latitude, longitude },
            read: false,
          });
        }
      }

      return res
        .status(200)
        .send("Location updated & Geofence checked");
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
);
