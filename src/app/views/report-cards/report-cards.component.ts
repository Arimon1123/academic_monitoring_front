import {Component, TemplateRef, ViewChild} from '@angular/core';
import {GradeDTO} from "../../models/GradeDTO";
import {ClassListDTO} from "../../models/ClassListDTO";
import {GradeService} from "../../service/grade.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {ClassService} from "../../service/class.service";
import {ReportCardService} from "../../service/reportcard.service";
import {FormsModule} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import {ModalService} from "../../service/modal.service";

@Component({
  selector: 'app-report-cards',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle,
    NgClass
  ],
  templateUrl: './report-cards.component.html',
  styleUrl: './report-cards.component.css'
})
export class ReportCardsComponent {
  @ViewChild('modal') modal: TemplateRef<any> | undefined;
  gradeList: GradeDTO[];
  classList: ClassListDTO[];
  selectedClass: number[];
  selectedGradeId: number;
  bimester : number;
  isFinalReport: boolean;
  constructor(private gradeService: GradeService,
              private classService: ClassService,
              private reportCardService: ReportCardService,
              private modalService: ModalService) {
    this.gradeList = [];
    this.classList = [];
    this.selectedClass = [];
    this.bimester = 1;
    this.isFinalReport = false;
    this.selectedGradeId = 0;
  }
  ngOnInit(){
    this.getGradeList();
  }
  getGradeList(){
    this.gradeService.getAllGrades().subscribe(
      {
        next: (value:ResponseDTO<GradeDTO[]>) => {
          this.gradeList = value.content;
        }
      }
    )
  }
  getClassList(gradeId:number){
    this.selectedClass = [];
    this.selectedGradeId = gradeId;
    const year = new Date().getFullYear();
    this.classService.getClassListByGradeIdAndYearAndShift(gradeId, year , 1 ).subscribe(
      {
        next: (value: ResponseDTO<ClassListDTO[]>)=>{
          this.classList = value.content;
        }
      }
    )
  }
  addSelectedClass(event:any){
    const newId = event.target.value;
    if(event.target.checked){
      this.selectedClass.push(newId);
    }else{
      this.selectedClass = this.selectedClass.filter( (id) => {
        return id != newId;
      })
    }
    console.log(this.selectedClass)
  }
  downloadReportCards(){
    if(this.isFinalReport)
      this.bimester = 4;
    this.openModal();
    this.reportCardService.generateReportCards(this.selectedClass,this.bimester,this.isFinalReport).subscribe(
      {
        next: value => {
          const blob = new Blob([value],{type: 'application/zip'});
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.download = "notas.zip";
          anchor.href = url;
          anchor.click();
        }
      }
    )
  }
  onBimesterChange(event:any){
    this.bimester = event.target.value;
  }
  onFinalReportChange(event:any){
    this.isFinalReport = event.target.checked;
  }
  getStyles(id:number){
    return {
      'bg-active': this.selectedGradeId === id,
      'text-white': this.selectedGradeId === id,
      'bg-bg-color': this.selectedGradeId !== id
    }
  }
  openModal(){
    this.modalService.open(
      {
        content: this.modal!,
        options: {
          title: 'Boletas de notas',
          size: 'medium',
          isSubmittable: false,
          message: 'Las boletas de notas se están generando, por favor espere.\n' +
            'Se descargará un archivo zip con todas las boletas de notas.'
        }})
  }
}
