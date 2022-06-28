import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isLoading: boolean = false;
  posts: any = [
    {title: 'Title 1', content: 'Content of Post 1'},
    {title: 'Title 2', content: 'Content of Post 2'},
    {title: 'Title 3', content: 'Content of Post 3'}
  ];
  errors: any = null;
  postForm !: FormGroup;

  constructor(
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })
  }

  onPostAdd(){
    console.log(this.postForm.value)
  }

  onFetchPost(){
    console.log('fetching posts..')
  }
}
