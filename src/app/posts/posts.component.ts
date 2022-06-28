import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../model/post.model';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, OnDestroy{

  isLoading: boolean = false;
  posts !: Post[];
  subscription !: Subscription;

  constructor(private httpService: HttpServiceService ) { }

  ngOnInit(): void {
    this.subscription = this.httpService.postChangeSub.subscribe((data)=>{
      this.posts = data;
    })
    this.onFetchPost();
  }

  onFetchPost(){
    console.log('fetching posts..')
    this.httpService.getAllPosts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
