import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../model/post.model';

const API_URL = "http://localhost:3000/posts";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService implements OnInit{

  posts !: Post[];
  error : HttpErrorResponse | null = null;
  updateMode: boolean = false;
  updatePostId: number = -1;
  postChangeSub = new Subject<[Post[], HttpErrorResponse | null]>();
  populateFormSub = new Subject<[ Post, boolean]>()

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getCurrentUpdatingPostId(): number{
    return this.updatePostId;
  }

  getAllPosts(){
    this.http.get<Post[]>(API_URL).subscribe((response: Post[]) => {
      console.log('got all posts');
      console.log(response);
      this.posts = response;
      this.error = null;
      this.postChangeSub.next([this.posts, this.error]);
    }, (err: HttpErrorResponse)=>{
      console.log(err);
      this.posts = [];
      this.error = err;
      this.postChangeSub.next([this.posts, this.error])
    })
  }

  addPost(data: Post){
    this.http.post<Post>(API_URL, data).subscribe((response: Post)=> {
      console.log('added a post');
      console.log(response);
      this.getAllPosts();
    }, (err: HttpErrorResponse)=>{
      console.log('cant add a post');
      console.log(err);
      this.error = err;
      this.postChangeSub.next([this.posts, this.error]);
    })
  }

  updatePost(postId: number, updatedPost: Post){
    this.http.patch<Post>(`${API_URL}/${postId}`, updatedPost).subscribe((response: Post)=>{
      console.log('post updated');
      console.log(response);
      this.getAllPosts();
      this.disableUpdateMode();
    }, (err: HttpErrorResponse)=>{
      console.log('cant update a post');
      this.error = err;
      this.postChangeSub.next([this.posts, this.error]);
    })
  }

  deletePost(postId: number){
    this.http.delete<Post>(`${API_URL}/${postId}`).subscribe((response: Post)=>{
      console.log('post deleted');
      console.log(response);
      console.log(JSON.stringify(response));
      this.getAllPosts();
    }, (err: HttpErrorResponse)=>{
      console.log('can\'t delete post');
      this.error = err;
      this.postChangeSub.next([this.posts, this.error]);
    })
  }

  enableUpdateMode(id: number){
    this.http.get<Post>(`${API_URL}/${id}`).subscribe((response: Post)=>{
      console.log('enabling update mode');
      console.log(response);
      this.updateMode = true;
      this.updatePostId = id;
      this.populateFormSub.next([response, this.updateMode]);
    }, (err: HttpErrorResponse)=>{
      console.log('cant enable update mode');
      this.error = err;
      this.postChangeSub.next([this.posts, this.error]);
    })
  }

  disableUpdateMode(){
    this.updateMode = false;
    this.updatePostId = -1;
    this.populateFormSub.next([{title: '', content: ''}, this.updateMode]);
  }

  onPostSubmit(data: Post){
    if(this.updateMode){
      this.updatePost(this.updatePostId, data)
    }else{
      this.addPost(data);
    }
    this.disableUpdateMode();
  }
}
