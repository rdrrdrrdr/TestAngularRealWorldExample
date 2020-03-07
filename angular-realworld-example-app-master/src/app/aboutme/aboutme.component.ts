import { Component, OnInit } from '@angular/core';
import { ArticleListConfig, TagsService, UserService } from '../core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})
export class AboutmeComponent implements OnInit {

  constructor ( private router: Router,
    private tagsService: TagsService,
    private userService: UserService) {
   }

  
  showThisButtonRDR: boolean = false;
  
  isAuthenticated: boolean;
  //How does this below work - 
  listConfig: ArticleListConfig = {
    type: 'all',
    filters: {}
  };
  tags: Array<string> = [];
  tagsLoaded = false;

  selectedTag: string = "TestRDRSelectedTag";

  ngOnInit() {
    this.userService.isAuthenticated.subscribe(
      (authenticated) => {
        this.isAuthenticated = authenticated;
        this.showThisButtonRDR = true; //rdr added

        // set the article list accordingly
        if (authenticated) {
          this.setListTo('feed');
        } else {
          this.setListTo('all');
        }
      }
    );
 
    this.tagsService.getAll()
    .subscribe(tags => {
      this.tags = tags;
      this.tags.sort();
      this.tagsLoaded = true;
    });

    //set the initial selected tag
    this.tagsService.getAll()
    .subscribe(tags => {
      this.selectedTag = tags.find((tag)=> tag == "tag1"); //rdr added this myself Yea! - I set this value using arrow function
    });
  }

  setListTo(type: string = '', filters: Object = {}) {
    // If feed is requested but user is not authenticated, redirect to login
    if (type === 'feed' && !this.isAuthenticated) {
      this.router.navigateByUrl('/login');
      return;
    }
 
    this.showThisButtonRDR = !this.showThisButtonRDR; //rdr added - toggles the value --yea this works simple but it works

    // Otherwise, set the list object
    this.listConfig = {type: type, filters: filters};
  }

  goToHome(){
    //going home RDR
    this.router.navigateByUrl('/');
  }
  
}
