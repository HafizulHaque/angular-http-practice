import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  posts : Post[] = [];
  error : string | null = null;
  subscription !: Subscription;

  constructor(private httpService: HttpServiceService ) { }

  ngOnInit(): void {
    this.subscription = this.httpService.postChangeSub.subscribe((data: [Post[], HttpErrorResponse | null])=>{
      this.posts = data[0];
      this.error = data[1] ?  data[1].message : null;
    })
    this.onFetchPost();
  }

  onFetchPost(){
    console.log('fetching posts..')
    this.httpService.getAllPosts();
  }

  onUpdate(id: number | undefined){
    if(id===undefined){
      console.log('can\'t update post without an id')
      return;
    }
    this.httpService.enableUpdateMode(id);
  }

  onDelete(id: number | undefined){
    if(id===undefined){
      console.log('can\'t delete post without an id')
      return;
    }
    this.httpService.deletePost(id);
    if(this.httpService.getCurrentUpdatingPostId()===id){
      this.httpService.disableUpdateMode();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
