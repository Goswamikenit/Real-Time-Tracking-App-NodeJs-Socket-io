const socket = io();


if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude}= position.coords
        socket.emit("send-location", {latitude,longitude})
    },(Error)=>{
        console.error(Error)
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge: 0

    }
)
}
const Map = L.map('map').setView([0,0],10)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"By KenitGoswami",

}).addTo(Map)

const markers = {};

socket.on("recevie-location", (data)=>{
    const {id, latitude,longitude} = data;;
    Map.setView([latitude,longitude],16)
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(Map)
    }
})
socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        Map.removeLayer(markers[id])
        delete markers[id]
    }
})