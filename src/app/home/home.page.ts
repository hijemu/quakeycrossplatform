import { Component, OnInit, resolveForwardRef, NgZone } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Plugins } from '@capacitor/core';
import * as mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder } from '@capgo/nativegeocoder';
import { NavController, ModalController, LoadingController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    
    map: mapboxgl.Map | null = null;
    style = 'mapbox://styles/mapbox/outdoors-v9';
    lat = 13;
    lng = 122;
    earthquake_data:any = null;
    maploaded = false;
    current_location:any = null;
    data: any;
    accessToken = 'pk.eyJ1IjoiaGlqZW11IiwiYSI6ImNscmhja2U5ZDBtZHoyam54dzJpcmhjbGQifQ.sSARvB_c2YPJDTsXNPC2jQ';

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
  private ngZone: NgZone,
  private geolocation: Geolocation,
  public platform: Platform,
  ) {}
      

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  isPlatformWeb(): boolean {
    // Determine if the platform is web
    return !window.hasOwnProperty('cordova');
  }

  async getCurrentLocationNative() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Current position:', position);
      // Handle position data
    } catch (error) {
      console.error('Error getting location:', error);
      // Handle error
    }
  }




  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.current_location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        this.fetchEarthquakeData();
        this.buildMap();
      },
      (error) => {
        console.error('Error getting location', error);
      }
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
        // Handle the retrieved location data
      },
      (error) => {
        console.error('Error getting location:', error);
        // Handle errors when retrieving location
      }
    );
    
  }
  
  ionViewDidLoad(){
    this.buildMap();
    this.fetchEarthquakeData();
  }
  
  async openShareLocation() {
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
    


    if (this.platform.is('capacitor')) {
        try {
            const position = await Geolocation.getCurrentPosition();
            this.current_location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.fetchEarthquakeData();
            this.buildMap();
        } catch (error) {
            console.error('Error getting location', error);
        }
    } else {
        console.log('Geolocation not supported on web.');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.current_location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                this.fetchEarthquakeData();
                this.buildMap();
            },
            (error) => {
                console.error('Error getting location', error);
            }
        );
    }
  }
  
  
  
  fetchEarthquakeData() {
    console.log("fetch Earthquake Data is called");
    let url = "https://quakey.moodlearning.com/twitter/index.php";
    this.http.get(url).subscribe(
        (data: any) => {
            this.earthquake_data = data;
            // Check if this.map is not null before calling addmarkers
            if (this.map !== null) {
                this.addmarkers(this.earthquake_data, this.map);
            } else {
                console.error('Map is null. Unable to add markers.');
            }
        },
        (error) => {
            console.error('Error fetching earthquake data', error);
        }
    );
}

  addmarkers(earthquake: any, map: mapboxgl.Map) {
    if (earthquake) {
        let geojson: any;

        earthquake.forEach(function (eqdata: any) {
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
            geojson.features.forEach(function (marker: any) {
                // create a DOM element for the marker
                let el = document.createElement('div');
                el.className = 'marker';

                let url: string = 'url(https://quakey.moodlearning.com/assets/intensity/';

                if (eqdata.Magnitude < 3.0)
                    url += 'intensity2.png';
                else if (eqdata.Magnitude >= 3.0 && eqdata.Magnitude < 4.0)
                    url += 'intensity3.png';
                else if (eqdata.Magnitude >= 4.0 && eqdata.Magnitude < 5.0)
                    url += 'intensity4.png';
                else if (eqdata.Magnitude >= 5.0 && eqdata.Magnitude < 6.0)
                    url += 'intensity5.png';
                else
                    url += 'intensity6.png';

                el.style.backgroundImage = url;
                el.style.width = marker.properties.iconSize[0] + 'px';
                el.style.height = marker.properties.iconSize[1] + 'px';

                let popup = new mapboxgl.Popup()
                    .setHTML("<p><a href='"
                        + eqdata.link + "'><img src='" + eqdata.link + "'></img></a></p>" +
                        "<div style='color:#aa2929;'>" +
                        "<p> <ion-icon name='pin'></ion-icon> <b>Location: </b>" + eqdata.Location + "</p>" +
                        "<p> <ion-icon name='time'></ion-icon> <b>Time</b>:" + eqdata.DateAndTime + "</p>" +
                        "<p> <ion-icon name='pulse'></ion-icon><b>Magnitude </b>:" + eqdata.Magnitude + "</p>" +
                        "<p>  <ion-icon name='wifi' md='md-wifi'></ion-icon><b>Depth</b>:" + eqdata.Depth + "</p>" +
                        "</div>"
                    );

                // add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .setPopup(popup)
                    .addTo(map);
            });


        });
    } else {
        console.error('Earthquake data is null or undefined.');
    }
}

  get_kmdistance(current_location: any){

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
    console.log("Started building map");
    const philippinesBounds: [[number, number], [number, number]] = [
        [115.859375, 4.389385], // Southwest bounds of the Philippines
        [126.904764, 21.100406] // Northeast bounds of the Philippines
    ];

    if (!this.map) {
        const philippinesCenter: [number, number] = [121.774017, 12.879721];

        this.map = new mapboxgl.Map({
            container: 'map',
            style: this.style,
            zoom: 5, 
            center: philippinesCenter,
            maxBounds: philippinesBounds, // Restrict the map to the bounds of the Philippines
            accessToken: 'pk.eyJ1IjoiaGlqZW11IiwiYSI6ImNscmhja2U5ZDBtZHoyam54dzJpcmhjbGQifQ.sSARvB_c2YPJDTsXNPC2jQ' 
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

    // Use optional chaining to safely access this.map
    this.map?.on('move', () => {
        const { lng, lat } = this.map!.getCenter(); 
        const sw = this.map!.getBounds().getSouthWest();
        const ne = this.map!.getBounds().getNorthEast();

        const isOutsideBounds =
            lng < philippinesBounds[0][0] || 
            lng > philippinesBounds[1][0] || 
            lat < philippinesBounds[0][1] || 
            lat > philippinesBounds[1][1];   

        if (isOutsideBounds) {
           
            const newLng = Math.min(Math.max(lng, philippinesBounds[0][0]), philippinesBounds[1][0]);
            const newLat = Math.min(Math.max(lat, philippinesBounds[0][1]), philippinesBounds[1][1]);
            this.map!.setCenter([newLng, newLat]); 
        }
    }); 
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

  localnotif_condition(location: string, mode: string){
    if(mode =="magnitude")
       this.localnotif("Quakey - Above Magnitude 4.0 Earthquake Detected!");
    else
      this.localnotif("Quakey - Nearby Earthquake Warning! - Location: "+location);
  }

  calculateRadiusDistance(lat1: number, lat2: number, lon1: number, lon2: number){
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
