import { Component, OnInit } from '@angular/core';
import { Glasses } from '../glasses';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Dimension } from '../dimension';

@Component({
  selector: 'app-crawler',
  templateUrl: './crawler.component.html',
  styleUrls: ['./crawler.component.css']
})
export class CrawlerComponent implements OnInit {
  private glasses: Glasses[] = [];
  private id: string;

  constructor(private http: Http) {

  }

  ngOnInit() {

  }

  public crawl() {
    this.http.get('/glasses/downloadHTML?siteUrl=https://www.zennioptical.com/men-glasses-best-seller').subscribe(
      res => {
        const pageHTML = this.parseHTML(res.text());
        const glassesCatalog = pageHTML.getElementById('\\"product-tiles-container\\"').children;
        const glassesUrls = this.findLinks(glassesCatalog);

        this.getDimensions(glassesUrls).then((glasses: Glasses[]) => {
          console.log('Glasses:', glasses);

          this.saveGlasses(glasses);
        }).catch(err => {
          console.log('ERROR', err);
        });
      }
    );
  }

  private saveGlasses(glasses: Glasses[]) {
    console.log(glasses[0]);
    this.http.post('/glasses/saveGlasses', glasses).subscribe(
      (glassesSaveRes) => {
        console.log('Saved glasses!', glassesSaveRes.json());
      }, err => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  private parseHTML(textHTML: string): Document {
    const parser = new DOMParser();
    const parsedHTML: Document = parser.parseFromString(textHTML, 'text/html');

    return parsedHTML;
  }

  private findLinks(glassesCatalog: NodeListOf<Element>): string[] {
    const glassesUrlArray = [];
    for (let i = 0; i < glassesCatalog.length; i++) {
      let glass;
      const glassesElement = glassesCatalog[i].getElementsByClassName('\\"item-image')[0];
      let id = glassesElement.querySelector('img').getAttribute('alt');
      let imageLink = glassesElement.querySelector('img').getAttribute('src');
      let glassesLink = glassesElement.firstElementChild.getAttribute('href');

      id = id.substring(2, id.length - 2);
      imageLink = 'https://' + imageLink.substring(4, imageLink.length - 2);
      glassesLink = 'https://www.zennioptical.com' + glassesLink.substring(2, glassesLink.length - 2);

      glass = new Glasses(id);
      glass.setImagePath(imageLink);

      this.glasses.push(glass);
      glassesUrlArray.push(glassesLink);
    }
    return glassesUrlArray;
  }

  private getDimensions(glassesUrlArray: string[]): Promise<Glasses[]> {
    return new Promise((resolve, reject) => {
      glassesUrlArray.forEach((glassesUrl, index) => {
        this.http.get(`/glasses/downloadHTML?siteUrl=${glassesUrl}`).subscribe(
          res => {
            const doc = this.parseHTML(res.text());
            const dimensionsContainer: Element = doc.getElementsByClassName('\\"frame-size')[0];
            const sizes = dimensionsContainer.getElementsByTagName('li');
            const dimension: Dimension = { isAllSet: true };

            for (let i = 0; i < sizes.length; i++) {
              let part  = sizes[i].attributes[1].name;
              part = part.substr(0, part.length - 2);
              dimension[part] = parseInt(sizes[i].getElementsByTagName('span')[0].textContent, 10);
            }

            if (dimension) {
              this.glasses[index].setDimension(dimension);
            }

            this.glasses[index].setName(doc.getElementsByClassName('\\"pdp-info')[0].firstElementChild.innerHTML.replace(/\d+/g, ''));

            if (index >= glassesUrlArray.length - 1) {
              resolve(this.glasses);
            }
          }, error => {
            reject(error);
          }
        );
      });
    });
  }
}
