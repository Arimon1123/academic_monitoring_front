import {Component, ViewChild} from '@angular/core';
import {ActivityDTO} from "../../models/ActivityDTO";
import {ActivityService} from "../../service/activity.service";
import {AssignationDTO} from "../../models/AssignationDTO";
import {LocalStorageService} from "../../service/local-storage.service";
import {ResponseDTO} from "../../models/ResponseDTO";
import {NgClass} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ModalComponent} from "../../components/modal/modal.component";
import {Modal} from "flowbite";
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
  totalPercentage: number = 0;
  isUpdate : boolean;
  activityForm: FormGroup;
  updatedActivity: ActivityDTO;
  deleteActivityId: number
  title: string
  showForm : boolean;
  @ViewChild('modal') modal : ModalComponent | undefined;
  constructor(private activityService: ActivityService, private localStorage: LocalStorageService){
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
  ngOnInit() {
    this.getAllActivities();
  }
  getAllActivities(){
    console.log("aaa")
    this.activityService.getActivitiesByAssignationId(this.assignation.id).subscribe(
      {
        next: (response: ResponseDTO<ActivityDTO[]>) => {
          this.activityList = response.content;
          this.totalPercentage = this.activityList.reduce((acc, activity) => acc + activity.value, 0);
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
      newTotal = this.totalPercentage + parseInt(this.activityForm.controls['value'].value)
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
    this.showModal();
    this.deleteActivityId= activity.id
  }
  onDelete(){
    this.deleteActivity(this.deleteActivityId);
    this.closeModal();
  }
  deleteActivity(id:number){
    this.activityService.deleteActivity(id).subscribe(
      {
        next:(data:ResponseDTO<string>)=>{
          alert(data.message);
        },
        complete: ()=>{
          this.getAllActivities();
        }
      }
    )
  }

  showModal(){
    this.modal?.showModal();
  }
  closeModal(){
    this.modal?.hideModal();
  }
}
