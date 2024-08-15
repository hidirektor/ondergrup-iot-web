import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {interval} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {
  AlertComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent
} from "@coreui/angular";
import {DatePipe, NgIf} from "@angular/common";
import {HttpCoreInterceptor} from "../../../http-core.interceptor";

declare var google: any;

interface LayerOptions {
  dayNight: boolean;
  cloud: boolean;
  rainfall: boolean;
  snowfall: boolean;
  orbit: boolean;
  futureOrbit: boolean;
  horizon: boolean;
}

@Component({
  templateUrl: 'isstracker.component.html',
  standalone: true,
  imports: [
    CardBodyComponent,
    CardHeaderComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    DatePipe,
    CardFooterComponent,
    AlertComponent,
    NgIf,
    HttpClientModule
  ],
  styleUrls: ['isstracker.component.scss'],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class IsstrackerComponent implements OnInit {

  map: any;
  issMarker: any;
  darkMode = false;
  mapView = '2D';
  layers: LayerOptions = {
    dayNight: false,
    cloud: false,
    rainfall: false,
    snowfall: false,
    orbit: false,
    futureOrbit: false,
    horizon: false
  };
  showStatistics = false;
  statistics = {
    lat: 0,
    lon: 0,
    altitude: 0,
    velocity: 0,
    period: 0
  };

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef,
      private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB4ecBVpBwGZIKkawK2Tl5A8GwIn9RSYlE`;
      script.onload = () => {
        this.initMap();
        this.trackISS();
      };
      document.head.appendChild(script);
    } else {
      this.initMap();
      this.trackISS();
    }
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 2
    });

    this.issMarker = new google.maps.Marker({
      position: { lat: 0, lng: 0 },
      map: this.map,
      icon: {
        url: '../../../../assets/iss.png',
        scaledSize: new google.maps.Size(50, 50),  // Başlangıç boyutu
        size: new google.maps.Size(512, 512),      // Orijinal boyut
        origin: new google.maps.Point(0, 0),       // İkonun kaynağı
        anchor: new google.maps.Point(25, 25)      // İkonun merkezi
      },
      title: 'ISS Location'
    });

    // Harita yakınlaştırma değiştiğinde marker'ı güncelle
    this.map.addListener('zoom_changed', () => {
      const zoom = this.map.getZoom();
      const scaleFactor = Math.pow(2, zoom) / 16; // Zoom seviyesiyle orantılı olarak boyutlandır
      const newSize = Math.max(20, Math.min(512, 50 * scaleFactor)); // En küçük 20x20, en büyük 512x512

      this.issMarker.setIcon({
        url: '../../../../assets/iss.png',
        scaledSize: new google.maps.Size(newSize, newSize),
        size: new google.maps.Size(512, 512),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(newSize / 2, newSize / 2)
      });
    });
  }

  trackISS() {
    const issPath = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#FF0000', // Kırmızı: Aktif yörünge
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    const futureIssPath = new google.maps.Polyline({
      path: [],
      geodesic: true,
      strokeColor: '#00FF00', // Yeşil: Gelecek yörünge
      strokeOpacity: 0.6,
      strokeWeight: 2
    });

    issPath.setMap(this.map);
    futureIssPath.setMap(this.map);

    interval(5000).subscribe(() => {
      this.http.get<any>('http://api.open-notify.org/iss-now.json').subscribe(data => {
        const lat = parseFloat(data.iss_position.latitude);
        const lon = parseFloat(data.iss_position.longitude);

        const position = { lat, lng: lon };
        issPath.getPath().push(position);

        // Aktif yörünge
        this.issMarker.setPosition(position);
        this.map.setCenter(position);

        // Gelecek yörüngeyi güncelle
        const futurePosition = this.calculateFuturePosition(lat, lon);
        futureIssPath.getPath().push(futurePosition);

        // İstatistikleri güncelle
        this.statistics.lat = lat;
        this.statistics.lon = lon;
      });
    });
  }

  calculateFuturePosition(lat: number, lon: number): { lat: number, lng: number } {
    // Gelecek pozisyon için örnek bir hesaplama yapabilirsiniz. Bu örnek sabit bir değer döndürür.
    // Gerçekçi bir hesaplama yapmak için ileriye dönük bir tahmin algoritması kullanabilirsiniz.
    return { lat: lat + 0.1, lng: lon + 0.1 };
  }

  toggleMode() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark-mode', this.darkMode);
    this.map.setOptions({ styles: this.darkMode ? this.getDarkModeStyles() : [] });
  }

  toggleMapView() {
    this.mapView = this.mapView === '2D' ? '3D' : '2D';

    if (this.mapView === '3D') {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 3,
        mapTypeId: 'satellite',
        tilt: 45
      });
    } else {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapTypeId: 'roadmap'
      });
    }

    this.trackISS();
  }

  toggleLayer(layer: keyof LayerOptions) {
    this.layers[layer] = !this.layers[layer];
    // Implement code to show/hide the selected layer on the map
  }

  toggleStatistics() {
    this.showStatistics = !this.showStatistics;
  }

  currentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        new google.maps.Marker({
          position: userLocation,
          map: this.map,
          title: 'Your Location',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          }
        });

        this.map.setCenter(userLocation);
      }, error => {
        console.error('Error getting user location:', error);
        alert('Could not retrieve your location.');
      });
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  private getDarkModeStyles() {
    return [
      { elementType: 'geometry', stylers: [{ color: '#212121' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
      { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
      { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
      { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
      { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
      { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
      { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
      { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
      { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
      { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
      { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
      { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
    ];
  }
}