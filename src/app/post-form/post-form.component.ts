import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { Post } from '../model/post.model';
import { HttpServiceService } from '../services/http-service.service';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit, OnDestroy{

  postForm !: FormGroup;
  updateMode: boolean = false;
  updateFormDataSub !: Subscription;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpServiceService
  ) { }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    })
    this.updateFormDataSub = this.httpService.populateFormSub.subscribe((postData: Post)=>{
      this.populateFormWithData(postData);
    })
  }

  onPostSubmit(){
    console.log(this.postForm.value)
    this.httpService.onPostSubmit(this.postForm.value);
    this.onClear();
  }

  populateFormWithData(postData: Post){
    this.postForm.patchValue({
      title: postData.title,
      content: postData.content
    })
    this.updateMode = true;
  }

  onClear(){
    this.httpService.disableUpdateMode();
    this.updateMode = false;
    this.postForm.reset();
  }

  ngOnDestroy(): void {
    
  }

}
