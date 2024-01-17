import { Component, OnInit, resolveForwardRef, NgZone } from '@angular/core';

import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { NavController, ModalController, LoadingController, NavParams, Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    map: mapboxgl.Map;
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lat = 13;
    lng = 122;
    earthquake_data:any = null;
    maploaded = false;
    current_location:any = null;
    data: any;
    accessToken = 'pk.eyJ1IjoibW9vZGxlYXJuZXIiLCJhIjoiY2s4cHdjMmRuMGhhbDNmcHM5a2w3dmVqOSJ9._Ftf5mEkRBBcUa6PjRYECg';

    geoAddress: any;
    geoLatitude: any;
    geoLongitude: any;
    distance: any;

    private modalOpen:boolean = false;

    constructor(
  public navCtrl: NavController,
  private modal: ModalController,
  private http: HttpClient,
  private loadingCtrl: LoadingController,
  //private localNotifications: LocalNotifications,
  public navParams: NavParams,
  //public nativeGeocoder: NativeGeocoder,
  private ngZone: NgZone,
  private geolocation: Geolocation,
  public platform: Platform,
) {
        this.initializeAsync();
      }
      
      async initializeAsync() {
        mapboxgl.accessToken = this.accessToken;
      
        let loading = await this.loadingCtrl.create({
          message: 'Loading...'
        });
      
        loading.present();
      
        let timeout = 1000;
      
        setTimeout(() => {
          if (this.earthquake_data !== undefined && this.current_location !== undefined) {
            this.openShareLocation();
            this.get_kmdistance(this.current_location);
            console.log(this.earthquake_data, "earthquakes");
            console.log(this.current_location, "current location");
            loading.dismiss();
          } else {
            loading.dismiss();
          }
        }, timeout);
      }
      

  ngOnInit() {
  }

  ionViewDidLoad(){
    // this.openShareLocation();
    this.buildMap();
    this.fetchEarthquakeData();
  }
  
  openShareLocation() {
    Geolocation.getCurrentPosition().then((position) => {
      var longitude = position.coords.longitude;
      var latitude = position.coords.latitude;
      this.geoLatitude = position.coords.latitude;
      this.geoLongitude = position.coords.longitude;
      this.current_location = ({ latitude, longitude });
  
      let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + this.geoLongitude + "," + this.geoLatitude + ".json?access_token=" + this.accessToken;
  
      this.http.get(url).subscribe(data => {
        this.geoAddress = data;
        const eqdata = {
          address: this.geoAddress.features[0].place_name,
          latitude: this.geoLatitude,
          longitude: this.geoLongitude
        };
  
        if (!this.modalOpen) {
          this.modalOpen = true;
  
          this.modal.create({
            component: 'ShareOptionsPage',
            componentProps: { data: eqdata }
          }).then(modal => {
            modal.present();
  
            modal.onDidDismiss().then(() => {
              this.modalOpen = false;
            });
          });
        }
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  
  
  
  fetchEarthquakeData(){
    console.log("fetch Earthquake Data is called");
    let incomingdata:any; 
    let url = "https://quakey.moodlearning.com/twitter/index.php";
    this.http.get(url).subscribe(
        data => {
          this.earthquake_data = data;
          //this.localnotif_condition(this.earthquake_data.Magnitude, this.earthquake_data.Location);
          this.addmarkers(this.earthquake_data, this.map);
          resolveForwardRef(this.earthquake_data);
        },
        complete => {
          console.log("done")
           resolveForwardRef(this.earthquake_data);
        
  
        }
  
        );
  
  }

  addmarkers(earthquake:any, map:mapboxgl.Map){
    let geojson : any;
    
    earthquake.forEach(function(eqdata){
      
          
      geojson = {
        'type': 'FeatureCollection',
        'features': [
        {
        'type': 'Feature',
        'properties': {
        'message': 'Foo',
        'iconSize': [100, 100]
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [eqdata.LongiTude, eqdata.Latitude]
        }
        }]
        };  
    
       
      // add markers to map
      geojson.features.forEach(function(marker) {
        // create a DOM element for the marker
        let el = document.createElement('div');
        el.className = 'marker';
        
        let url:string = 'url(https://quakey.moodlearning.com/assets/intensity/';
  
        if(eqdata.Magnitude < 3.0)
           url+='intensity2.png';
        else if(eqdata.Magnitude >= 3.0 && eqdata.Magnitude < 4.0)
          url+='intensity3.png';
        else if(eqdata.Magnitude >= 4.0 && eqdata.Magnitude < 5.0)
          url+='intensity4.png';
        else if(eqdata.Magnitude >= 5.0 && eqdata.Magnitude < 6.0)
          url+='intensity5.png';
        else
          url+='intensity6.png';
  
        el.style.backgroundImage = url;
        el.style.width = marker.properties.iconSize[0] + 'px';
        el.style.height = marker.properties.iconSize[1] + 'px';
        
        let popup = new mapboxgl.Popup()
        .setHTML("<p><a href='"
        +eqdata.link+"'><img src='"+eqdata.link+"'></img></a></p>"+
                "<div style='color:#aa2929;'>"+
                "<p> <ion-icon name='pin'></ion-icon> <b>Location: </b>"+eqdata.Location+"</p>"+
                "<p> <ion-icon name='time'></ion-icon> <b>Time</b>:"+eqdata.DateAndTime+"</p>"+
                "<p> <ion-icon name='pulse'></ion-icon><b>Magnitude </b>:"+eqdata.Magnitude+"</p>"+
                "<p>  <ion-icon name='wifi' md='md-wifi'></ion-icon><b>Depth</b>:"+eqdata.Depth+"</p>"+
                "</div>"
                );
  
        // add marker to map
        new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);
        });
  
       
      });
       
    
  }

  get_kmdistance(current_location){

    if(this.earthquake_data != undefined && current_location != undefined)
    {
  
    for(let x=0; x<this.earthquake_data.length; x++){
  
       let lat1 = parseFloat(current_location.latitude);
       let lat2 = parseFloat(this.earthquake_data[x].Latitude);
       let lon1 = parseFloat(current_location.longitude);
       let lon2 = parseFloat(this.earthquake_data[x].LongiTude);
      
      let kmdistance = this.calculateRadiusDistance(lat1, lat2, lon1, lon2);
  
      this.distance = kmdistance;
  
      if(kmdistance <= 300)
        { 
          let str = "Quakey - Nearby Earthquake Warning! - Location: "+this.earthquake_data[x].Location;
          this. localnotif(str);
        }
      
      if(this.earthquake_data[x].Magnitude >= 4.0)
        {
          let str = "Quakey - Above Magnitude 4.0 Earthquake Detected!";
          this. localnotif(str);
        }
  
    }

  }
  else{
    alert("Please make sure that location permission is enabled. ");
    this.refreshpage();
  }
  
  }

  buildMap() {
    console.log("Started building map")
     
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 4.5,
      center: [this.lng, this.lat]
    });
    this.map.resize();
    
    this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    const geolocate = new mapboxgl.GeolocateControl({
      fitBoundsOptions: {
        maxZoom: 4.5
    },
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true
    });
    this.map.addControl(geolocate, 'bottom-right');
  
    console.log("Map loaded");
  }

  async refreshpage() {
    const loading = await this.loadingCtrl.create({
      message: 'Refreshing data..'
    });
  
    await loading.present();
  
    setTimeout(async () => {
      await this.fetchEarthquakeData();
      await this.openShareLocation();
  
      await loading.dismiss();
    }, 4000);
  }
  
  
  
  
  

  localnotif(str: string) {
    LocalNotifications.schedule({
      notifications: [
        {
          title: 'Your Notification Title',
          body: str,
          id: 1,
          sound: 'beep.mp3',
        }
      ]
    });
  
    console.log("called notif", str);
  }

  localnotif_condition(location, mode){
    if(mode =="magnitude")
       this.localnotif("Quakey - Above Magnitude 4.0 Earthquake Detected!");
    else
      this.localnotif("Quakey - Nearby Earthquake Warning! - Location: "+location);
  }

  calculateRadiusDistance(lat1, lat2, lon1, lon2){
    let radlat1 = Math.PI * lat1/180;
    let radlat2 = Math.PI * lat2/180;
    let theta = lon1-lon2;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    if (dist > 1) {
      dist = 1;
    }
   dist = Math.acos(dist);
   console.log(dist, "value ti dist after acos");
   dist = dist * 180/Math.PI;
   dist = dist * 60 * 1.1515;
   dist = dist * 1.609344;
  
   return dist;
    }




}
