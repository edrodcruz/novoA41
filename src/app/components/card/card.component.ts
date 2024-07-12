import { Component, EventEmitter, Input, numberAttribute, Output } from '@angular/core';


@Component({
  selector: 'cardResumo',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})

export class CardComponent {
  @Input() tipo: "black" | "blue" | "green" | "yellow" | "lemon" | "red" = "black"
  @Input({transform:numberAttribute}) cont:number=0
  @Input() cabec:string=''
  @Input() desc:string=''
  @Output() clickBotao: EventEmitter<any>=new EventEmitter()

  ngOnInit() { }

  execFunction(){
    this.clickBotao.emit()
  }

}
