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
  postChangeSub = new Subject<any>();

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
    this.http.post<Post>(API_URL, data).subscribe(response=> {
      this.getAllPosts();
    })
  }
}
