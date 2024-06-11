import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivityDTO } from '../../models/ActivityDTO';
import { ActivityService } from '../../service/activity.service';
import { AssignationDTO } from '../../models/AssignationDTO';
import { ResponseDTO } from '../../models/ResponseDTO';
import { NgClass } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ModalService } from '../../service/modal.service';
import { ActivatedRoute } from '@angular/router';
import { AssignationService } from '../../service/assignation.service';
import { ConfigurationDataService } from '../../service/configuration-data.service';
import { ActivityCardComponent } from '../../components/activity-card/activity-card.component';
@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    ModalComponent,
    ActivityCardComponent,
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css',
})
export class ActivityListComponent implements OnInit {
  activities: { [key: string]: ActivityDTO[] };
  assignation: AssignationDTO;
  totalPercentage: { [key: string]: number };
  isUpdate: boolean;
  activityForm: FormGroup;
  updatedActivity: ActivityDTO;
  deleteActivityId: number;
  title: string;
  showForm: boolean;
  bimester: number;
  @ViewChild('modal') content: TemplateRef<unknown> | undefined;

  constructor(
    private activityService: ActivityService,
    private activeRoute: ActivatedRoute,
    private assignationService: AssignationService,
    private modalService: ModalService,
    private configDatService: ConfigurationDataService
  ) {
    this.totalPercentage = {};
    this.title = 'Nueva actividad';
    this.updatedActivity = {} as ActivityDTO;
    this.deleteActivityId = 0;
    this.showForm = false;
    this.activities = {};
    this.assignation = {} as AssignationDTO;
    this.isUpdate = false;
    this.bimester = 1;
    this.activityForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
      dimension: new FormControl('-1', [Validators.required]),
    });
  }
  dimensionValue: { [key: string]: number } = {
    HACER: 30,
    SABER: 30,
    SER: 20,
    DECIDIR: 20,
  };
  ngOnInit() {
    this.getConfiguration();
  }
  getConfiguration() {
    this.configDatService.currentConfig.subscribe({
      next: value => {
        this.bimester = value!.currentBimester;
        this.activeRoute.params.subscribe({
          next: params => {
            this.getAllActivities(params['id']);
            this.getAssignationById(params['id']);
          },
        });
      },
    });
  }
  getAllActivities(assignationId: number) {
    this.activityService
      .getActivitiesByAssignationId(assignationId, this.bimester)
      .subscribe({
        next: (response: ResponseDTO<ActivityDTO[]>) => {
          this.filterActivities(response.content);
        },
      });
  }
  getAssignationById(assignationId: number) {
    this.assignationService.getAssignationById(assignationId).subscribe({
      next: (data: ResponseDTO<AssignationDTO>) => {
        this.assignation = data.content;
      },
    });
  }
  saveActivity(newActivity: ActivityDTO) {
    this.activityService.saveActivity(newActivity).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Actividad guardada', data.message);
      },
      error: (error: ResponseDTO<string>) => {
        this.openModal('Error', error.message);
      },
      complete: () => {
        this.getAllActivities(this.assignation.id);
      },
    });
  }
  onSubmit() {
    let newTotal = 0;
    if (!this.isUpdate)
      newTotal =
        this.totalPercentage[4] +
        parseInt(this.activityForm.controls['value'].value) *
          this.dimensionValue[
            this.activityForm.controls['dimension'].value / 100
          ];
    else
      newTotal =
        this.totalPercentage[4] -
        this.updatedActivity.value +
        parseInt(this.activityForm.controls['value'].value);
    if (newTotal > 100) {
      this.openModal('Error', 'El total no puede ser mayor a 100');
      return;
    }
    if (!this.isUpdate) {
      const newActivity: ActivityDTO = {
        ...this.activityForm.value,
        id: null,
        status: 1,
        bimester: this.bimester,
        assignationId: this.assignation.id,
      };
      this.saveActivity(newActivity);
    } else {
      const newActivity: ActivityDTO = {
        ...this.activityForm.value,
        id: this.updatedActivity.id,
        status: 1,
        bimester: this.bimester,
        assignationId: this.assignation.id,
      };
      this.updateActivity(newActivity);
    }
    this.showForm = false;
  }
  onUpdate(activity: ActivityDTO) {
    this.isUpdate = true;
    this.showForm = true;
    this.updatedActivity = activity;
    this.title = 'Editar actividad';
    this.activityForm.controls['name'].setValue(activity.name);
    this.activityForm.controls['value'].setValue(activity.value);
    this.activityForm.controls['dimension'].setValue(activity.dimension);
    this.activityForm.updateValueAndValidity();
  }
  onNewActivity() {
    this.activityForm.reset();
    this.activityForm.controls['dimension'].setValue('-1');
    this.activityForm.updateValueAndValidity();
    this.title = 'Nueva actividad';
    this.isUpdate = false;
    this.showForm = true;
  }
  updateActivity(activity: ActivityDTO) {
    this.activityService.updateActivity(activity).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Actividad actualizada', data.message);
      },
      complete: () => {
        this.getAllActivities(this.assignation.id);
      },
    });
  }
  onDeleteActivity(activity: ActivityDTO) {
    this.openDeleteModal(
      'Se eliminará la actividad y todas las  notas asociadas de forma permanente ¿Desea continuar?',
      'Eliminar actividad'
    ).subscribe({
      next: () => {
        this.deleteActivity(activity.id);
      },
    });
  }
  deleteActivity(id: number) {
    this.activityService.deleteActivity(id).subscribe({
      next: (data: ResponseDTO<string>) => {
        this.openModal('Actividad eliminada', data.message);
      },
      complete: () => {
        this.getAllActivities(this.assignation.id);
      },
    });
  }
  openDeleteModal(message: string, title: string) {
    return this.modalService.open({
      content: this.content!,
      options: {
        size: 'small',
        isSubmittable: true,
        message: message,
        title: title,
      },
    });
  }
  openModal(title: string, message: string) {
    this.modalService.open({
      content: this.content!,
      options: {
        title: title,
        message: message,
      },
    });
  }
  filterActivities(activityDTO: ActivityDTO[]) {
    this.activities['DECIDIR'] = activityDTO.filter(
      activity => activity.dimension === 'DECIDIR'
    );
    this.activities['HACER'] = activityDTO.filter(
      activity => activity.dimension === 'HACER'
    );
    this.activities['SABER'] = activityDTO.filter(
      activity => activity.dimension === 'SABER'
    );
    this.activities['SER'] = activityDTO.filter(
      activity => activity.dimension === 'SER'
    );
    this.totalPercentage['DECIDIR'] = this.activities['DECIDIR'].reduce(
      (acc, activity) =>
        acc + (activity.value * this.dimensionValue[activity.dimension]) / 100,
      0
    );
    this.totalPercentage['HACER'] = this.activities['HACER'].reduce(
      (acc, activity) =>
        acc + (activity.value * this.dimensionValue[activity.dimension]) / 100,
      0
    );
    this.totalPercentage['SABER'] = this.activities['SABER'].reduce(
      (acc, activity) =>
        acc + (activity.value * this.dimensionValue[activity.dimension]) / 100,
      0
    );
    this.totalPercentage['SER'] = this.activities['SER'].reduce(
      (acc, activity) =>
        acc + (activity.value * this.dimensionValue[activity.dimension]) / 100,
      0
    );
    this.totalPercentage['TOTAL'] = activityDTO.reduce(
      (acc, activity) =>
        acc + (activity.value * this.dimensionValue[activity.dimension]) / 100,
      0
    );
  }
}
