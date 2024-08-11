const socket = io();

//console.log("Hey");

if (navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        socket.emit("send-location",{latitude, longitude});
    },
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }

    
    );
}

const map = L.map("map").setView([0,0], 10); //default zoom
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Scaler School Of Technology"
}).addTo(map)

const markers = {};

socket.on("recieve-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude,longitude], 16); //zoom on map
    if (markers [id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id] = L.marker([latitude,longitude], {icon: Bus}).addTo(map);
    }
})

socket.on("user-disconnected", (id)=>{
    if (markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

var Bus = L.icon({
    iconUrl: '/images/BUS.png',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});