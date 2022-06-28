import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {

  postForm !: FormGroup;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpServiceService
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })
  }

  onPostAdd(){
    console.log(this.postForm.value)
    this.httpService.addPost(this.postForm.value);
    this.postForm.reset();
  }

}
