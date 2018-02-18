import { Component } from '@angular/core';
import { Glasses } from './glasses';
import { Http } from '@angular/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public glassesArray: Array<Glasses> = [];

    constructor(private http: Http) {
        this.init();
    }

    private init(): void {
        this.http.get('/glasses/gallery').subscribe(
            (res) => {
                if (res.ok) {
                    this.glassesArray = res.json();
                }
            }, error => {
                console.log(error);
            }
        );

    }
}
