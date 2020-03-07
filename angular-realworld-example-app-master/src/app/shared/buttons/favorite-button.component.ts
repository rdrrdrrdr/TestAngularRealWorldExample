import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { Article, ArticlesService, UserService } from '../../core';
import { of } from 'rxjs';
import { concatMap ,  tap } from 'rxjs/operators';

@Component({
  selector: 'app-favorite-button',
  templateUrl: './favorite-button.component.html'
})
export class FavoriteButtonComponent {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService
  ) {}

  @Input() article: Article;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;

  toggleFavorite() {
    this.isSubmitting = true; //this gets set at the beginning

    this.userService.isAuthenticated.pipe(concatMap(
      (authenticated) => {
        console.log('rdr Authenticated =' + JSON.stringify(authenticated))
        // Not authenticated? Push to login screen
        if (!authenticated) {
          this.isSubmitting = false;
          this.router.navigateByUrl('/login');
          return of(null);
        }

        //if (authenticated){
        //  this.router.navigateByUrl('/login');
        //  return of(null);
        //}

        // Favorite the article if it isn't favorited yet
        if (!this.article.favorited) {
          return this.articlesService.favorite(this.article.slug)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(true);
            },
            err => this.isSubmitting = false
          ));

        // Otherwise, unfavorite the article
        } else {
          return this.articlesService.unfavorite(this.article.slug)
          .pipe(tap(
            data => {
              this.isSubmitting = false;
              this.toggle.emit(false);
            },
            err => this.isSubmitting = false
          ));
        }



      }
    )).subscribe(data2=> 
      console.log('RDRThis is the subscribe data in favorite-button' + JSON.stringify(data2))
      );
  }
}
