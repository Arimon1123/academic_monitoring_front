import {Component, TemplateRef, ViewChild} from '@angular/core';
import {ActivityDTO} from "../../models/ActivityDTO";
import {ActivityService} from "../../service/activity.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {LocalStorageService} from "../../service/local-storage.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {NgClass} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalComponent} from "../../components/modal/modal.component";
import {Modal} from "flowbite";
import {ModalService} from "../../service/modal.service";
import {normalizeExtraEntryPoints} from "@angular-devkit/build-angular/src/tools/webpack/utils/helpers";
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    ModalComponent
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css'
})
export class ActivityListComponent {
  activityList: ActivityDTO[];
  assignation: AssignationDTO;
  totalPercentage: number;
  isUpdate : boolean;
  activityForm: FormGroup;
  updatedActivity: ActivityDTO;
  deleteActivityId: number
  title: string
  showForm : boolean;
  @ViewChild('modal') content:   TemplateRef<any> | undefined;

  constructor(private activityService: ActivityService,
              private localStorage: LocalStorageService,
              private modalService: ModalService){
    this.totalPercentage = 0;
    this.title = "Nueva actividad";
    this.updatedActivity = {} as ActivityDTO;
    this.deleteActivityId = 0;
    this.showForm = false;
    this.activityList = [];
    this.assignation = JSON.parse(this.localStorage.getItem("assignation") as string);
    this.isUpdate = false;
    this.activityForm = new FormGroup<any>(
      {
        name: new FormControl('',[Validators.required]),
        value: new FormControl( '', [Validators.required]),
        dimension: new FormControl('-1', [Validators.required]),
      }
    )
  }
  dimensionValue : {[key:string]: number} = {
    HACER:30,
    SABER:30,
    SER:20,
    DECIDIR:20
  }
  ngOnInit() {
    this.getAllActivities();
  }
  getAllActivities(){
    this.activityService.getActivitiesByAssignationId(this.assignation.id,1).subscribe(
      {
        next: (response: ResponseDTO<ActivityDTO[]>) => {
          this.activityList = response.content;
          this.totalPercentage = this.activityList.reduce((acc, activity) => acc + activity.value * this.dimensionValue[activity.dimension]/100 , 0);
        }
      }
    );
  }
  saveActivity(newActivity: ActivityDTO){
    this.activityService.saveActivity(newActivity).subscribe(
      {
        next: (data:ResponseDTO<string>)=> {
          alert(data.message);
        },
        error: (error:ResponseDTO<string>)=>{
          alert(error.message)        },
        complete: ()=>{
          this.getAllActivities();
        }
      }
    )
  }
  onSubmit(){
    let newTotal = 0;
    if(!this.isUpdate)
      newTotal = this.totalPercentage + parseInt(this.activityForm.controls['value'].value) * this.dimensionValue[this.activityForm.controls['dimension'].value /100]
    else
      newTotal = this.totalPercentage - this.updatedActivity.value + parseInt(this.activityForm.controls['value'].value);
    if(newTotal > 100 ){
      alert("El total no puede ser mayor a 100")
      return;
    }
    if(!this.isUpdate){
      const newActivity:ActivityDTO = {
        ...this.activityForm.value,
        id : null,
        status: 1,
        bimester: 1,
        assignationId: this.assignation.id
      }
      this.saveActivity(newActivity);
    }else{
      const newActivity:ActivityDTO = {
        ...this.activityForm.value,
        id : this.updatedActivity.id,
        status: 1,
        bimester: 1,
        assignationId: this.assignation.id
      }
      this.updateActivity(newActivity);
    }

  }
  onUpdate(activity: ActivityDTO){
    this.isUpdate =true;
    this.showForm = true;
    this.updatedActivity  = activity;
    this.title = "Editar actividad"
    this.activityForm.controls['name'].setValue(activity.name);
    this.activityForm.controls['value'].setValue(activity.value);
    this.activityForm.controls['dimension'].setValue(activity.dimension);
    this.activityForm.updateValueAndValidity();
  }
  onNewActivity(){
    this.activityForm.reset();
    this.activityForm.controls['dimension'].setValue('-1');
    this.activityForm.updateValueAndValidity();
    this.title = "Nueva actividad"
    this.isUpdate = false;
    this.showForm = true;
  }
  updateActivity(activity:ActivityDTO){
    this.activityService.updateActivity(activity).subscribe(
      {
        next: (data:ResponseDTO<string>)=>{
          alert(data.message);
        }, complete: ()=>{
          this.getAllActivities();
        }
      }
    )
  }
  onDeleteActivity(activity:ActivityDTO){
    this.openDeleteModal('Se eliminará la actividad y todas las  notas asociadas de forma permanente ¿Desea continuar?', 'Eliminar actividad')
      .subscribe(
        {
          next: data => {
            this.deleteActivity(activity.id)
          }
        }
      )

  }
  onDelete(){
    this.deleteActivity(this.deleteActivityId);

  }
  deleteActivity(id:number){
    this.activityService.deleteActivity(id).subscribe(
      {
        next:(data:ResponseDTO<string>)=>{
          this.openModal("Actividad eliminada",data.message);
        },
        complete: ()=>{
          this.getAllActivities();
        }
      }
    )
  }
  openDeleteModal(message:string, title:string){
    return this.modalService.open({content: this.content!, options: {
      size: 'small',
      isSubmittable: true,
      message:message,
      title:title
    }})
  }
  openModal(title:string, message:string){
    this.modalService.open({content:this.content!,
      options: {
        title: title,
        message: message
      }
    })
  }
}
