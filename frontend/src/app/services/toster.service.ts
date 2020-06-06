import { Injectable } from '@angular/core';

declare var toastr:any

@Injectable({
  providedIn: 'root'
})
export class TosterService
{

  constructor()
  {
    this.setting();
  }

  Success(message:string,title?:string)
  {
    toastr.success(message,title);
  }

  Warning(message:string,title?:string)
  {
    toastr.warning(message,title);
  }

  Error(message:string,title?:string)
  {
    toastr.error(message,title);
  }

  Info(message:string)
  {
    toastr.info(message);
  }

  setting()
  {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "3000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }

}
