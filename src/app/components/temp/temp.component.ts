import { Component } from '@angular/core';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent {

  checkEquivalente:boolean=false
  itemEquivalente:string=''

  habilitarCampos(){
    alert(this.checkEquivalente)

  }

}
