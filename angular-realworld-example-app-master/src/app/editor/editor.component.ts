import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core';
import { Subscription } from 'rxjs';
import { User, Profile } from '../core';
 

import { Article, ArticlesService } from '../core';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor.component.html'
})
export class EditorComponent implements OnInit {
  article: Article = {} as Article;
  articleForm: FormGroup;
  tagField = new FormControl();
  errors: Object = {};
  isSubmitting = false;
  


  private subscription: Subscription;

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    // use the FormBuilder to create a form group
    this.articleForm = this.fb.group({
      title: '',
      description: '',
      body: ''
    });

    

    // Initialized tagList as empty array
    this.article.tagList = [];

    // Optional: subscribe to value changes on the form
    // this.articleForm.valueChanges.subscribe(value => this.updateArticle(value));
  }

  currentUser: User;

  ngOnInit() {
    // If there's an article prefetched, load it
    this.route.data.subscribe((data: { article: Article }) => {
      if (data.article) {
        this.article = data.article;
        this.articleForm.patchValue(data.article);
      }
    });

    //RDR added here
    // Load the current user's data
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      });

  }

  addTag() {
    // retrieve tag control
    const tag = this.tagField.value;
    // only add tag if it does not exist yet
    if (this.article.tagList.indexOf(tag) < 0) {
      this.article.tagList.push(tag);
    }
    // clear the input
    this.tagField.reset('');
  }

  removeTag(tagName: string) {
    this.article.tagList = this.article.tagList.filter(tag => tag !== tagName);
  }

  submitForm() {
    this.isSubmitting = true;

    // update the model
    this.updateArticle(this.articleForm.value);

    // post the changes
    this.articlesService.save(this.article).subscribe(
      article => this.router.navigateByUrl('/article/' + article.slug),
      err => {
        this.errors = err;
        this.isSubmitting = false;
      }
    );
  }

  updateArticle(values: Object) {
    Object.assign(this.article, values);
  }
}
