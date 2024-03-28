import { ElementRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RequestService } from '../request.service';
import { User } from '../models/user';
import { Agency } from '../models/agency';
import { AgencyService } from '../agency.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService, private reqService:RequestService,  private router: Router,private http: HttpClient,
    private agencyService:AgencyService) {
    this.token = undefined;
  }

  ngOnInit(): void {
    this.agencyService.getAll().subscribe((data:Agency[])=>{
      this.agencies=data;
    })
  }

  name:string;
  surname:string;
  username:string;
  password:string;
  password2:string;
  town:string;
  birthDate:string;
  phoneNumber:Number;
  email:string;
  agency:string;
  licenceNumber:Number;
  type:string;
  token:string|undefined; //reCAPTCHA
  img:File=null;
  agencies:Agency[];

  errorEverythingFilled:string;
  fieldsValid:boolean=false;

  errorPassword:string;

  passwordValid:boolean;
  
  captchaValid:boolean;
  captchaMessage:string;
  
  errorUsername:String;
  usernameValid:boolean;

  errorEmail:String;
  emailValid:boolean;

  
  onFileSelected(event){
    this.img=<File>event.target.files[0];
    console.log(this.img);
   }

 
  registerMe(){
    this.errorEverythingFilled="";
    this.errorPassword="";
    this.errorUsername="";
    this.errorEmail="";
    this.fieldsValid;
    this.passwordValid;
    this.usernameValid;
    this.emailValid;
    this.everythingFilledCheck();
    this.passwordCheck();
    this.usernameCheck();
    this.emailCheck();
    console.log("username",this.usernameValid)
   if(this.fieldsValid && this.captchaValid && this.passwordValid && this.usernameValid && this.emailValid){
    this.reqService.registerUserService(this.name,this.surname,this.username,this.password,this.town,
      this.birthDate,this.phoneNumber,this.email,this.type,this.agency,this.licenceNumber).subscribe(response=>{
        if(this.img!=null){
        this.reqService.uploadImageService(this.img,this.username).subscribe(()=>{
        });
      }
      if(response['message']=='user added')
        alert("Uspesno ste poslali zahtev za registraciju")
        this.router.navigate(['']); 
           
      });
    }
  }
  //check if everything is filled
  /* validate(){
    var form = document.getElementsByClassName('needs-validation')[0] as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }*/

  passwordCheck(){
    if(this.password!=this.password2){
      this.errorPassword='Lozinke nisu iste';
    }
    else this.passwordValid=true;
  }

  everythingFilledCheck(){
    if(this.name && this.surname && this.username && this.password && this.password2 && this.town && this.birthDate
      && this.phoneNumber && this.email && this.type){
        this.fieldsValid=true;
      }
      else this.errorEverythingFilled="Morate uneti sve podatke";
  }

  usernameCheck(){
    
    this.userService.usernameCheck(this.username).subscribe((user:User)=>{
      if(user)this.errorUsername="Ovo korisničko ime je zauzeto";
      else this.usernameValid=true;
      console.log(user);
    })
  }

  emailCheck(){
    this.userService.emailCheck(this.email).subscribe((user:User)=>{
      if(user)this.errorEmail="Ovaj mail je već u upotrebi";
      else this.emailValid=true;
      console.log(user);
    })
  }

  

  //reCAPTCHa
  public send(form: NgForm): void {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      this.captchaMessage="Ovo je obavezno polje"
      return;
    }
    this.captchaValid=true;
    console.debug(`Token [${this.token}] generated`);
  }

  /*checkEverything(ngform){
    this.validate();
    this.passwordCheck();
    this.send(ngform);
    if(this.formValid && this.passwordValid && this.captchaValid){
      this.registerMe();
    }

  }*/

  upload(){
    this.reqService.uploadImageService(this.img,"milica").subscribe(()=>{
    })
  }

}
