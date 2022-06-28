import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from './model/post.model';
import { HttpServiceService } from './services/http-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  posts !: Post[];
  errors: any = null;
  postForm !: FormGroup;
  subscription !: Subscription;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpServiceService
  ){}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })
    this.subscription = this.httpService.postChangeSub.subscribe((data)=>{
      this.posts = data;
    })
    this.onFetchPost();
  }

  onPostAdd(){
    console.log(this.postForm.value)
    this.httpService.addPost(this.postForm.value);
    this.postForm.reset();
  }

  onFetchPost(){
    console.log('fetching posts..')
    this.httpService.getAllPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
