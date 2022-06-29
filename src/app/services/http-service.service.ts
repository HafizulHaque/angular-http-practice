import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Post } from '../model/post.model';

const API_URL = "http://localhost:3000/posts";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService implements OnInit{

  posts !: Post[];
  updateMode: boolean = false;
  updatePostId: number = -1;
  postChangeSub = new Subject<Post[]>();
  populateFormSub = new Subject<Post>()

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(){
    this.http.get<Post[]>(API_URL).subscribe((response: Post[]) => {
      this.posts = response;
      this.postChangeSub.next(this.posts);
    })
  }

  addPost(data: Post){
    this.http.post<Post>(API_URL, data).subscribe((response: Post)=> {
      this.getAllPosts();
    })
  }

  updatePost(postId: number, updatedPost: Post){
    this.http.patch<Post>(`${API_URL}/${postId}`, updatedPost).subscribe((response: Post)=>{
      console.log('post updated');
      this.getAllPosts();
      this.disableUpdateMode();
    })
  }

  deletePost(postId: number){
    this.http.delete<Post>(`${API_URL}/${postId}`).subscribe((response: Post)=>{
      console.log(JSON.stringify(response));
      this.getAllPosts();
    })
  }

  enableUpdateMode(id: number){
    this.http.get<Post>(`${API_URL}/${id}`).subscribe((response: Post)=>{
      this.populateFormSub.next(response);
      this.updateMode = true;
      this.updatePostId = id;
    })
  }

  disableUpdateMode(){
    this.updateMode = false;
    this.updatePostId = -1;
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
