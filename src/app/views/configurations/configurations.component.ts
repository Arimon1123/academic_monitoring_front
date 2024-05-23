import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { UnfinishedSubjectDTO } from '../../models/UnfinishedSubjectDTO';
import { ConfigurationDTO } from '../../models/ConfigurationDTO';
import { ModalService } from '../../service/modal.service';
import { ConfigurationDataService } from '../../service/configuration-data.service';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css',
})
export class ConfigurationsComponent implements OnInit {
  ngOnInit() {
    this.getConfigurations();
  }
  @ViewChild('list') listModal: TemplateRef<unknown> | undefined;
  @ViewChild('message') messageModal: TemplateRef<unknown> | undefined;
  unfinishedSubjects: UnfinishedSubjectDTO[] = [];
  message = '';
  configuration: ConfigurationDTO = {} as ConfigurationDTO;
  constructor(
    private confService: ConfigurationService,
    private modalService: ModalService,
    private confDataService: ConfigurationDataService
  ) {}
  finishBimester() {
    this.confService.finishBimester().subscribe({
      next: response => {
        console.log(response);
        if (response.status === 200) {
          this.unfinishedSubjects = response.content;
          this.openModalUnfinishedSubjects();
        } else {
          this.openModal(response.message, 'Bimestre finalizado con exito');
          this.getConfigurationFromServer();
        }
      },
      error: error => {
        console.error(error);
      },
    });
  }
  finishYear() {
    this.confService.finishYear().subscribe({
      next: response => {
        console.log(response);
        this.openModal(response.message, 'Año finalizado con exito');
        this.getConfigurationFromServer();
      },
      error: error => {
        console.error(error);
      },
    });
  }
  getConfigurations() {
    this.confDataService.currentConfig.subscribe({
      next: value => {
        this.configuration = value!;
      },
    });
  }
  getConfigurationFromServer() {
    this.confService.getConfigurations().subscribe({
      next: value => {
        this.confDataService.setConfig(value.content);
      },
    });
  }
  openModalUnfinishedSubjects() {
    this.modalService.open({
      content: this.listModal!,
      options: {
        size: 'large',
        hasContent: true,
        data: this.unfinishedSubjects,
        isSubmittable: false,
        title: 'Materias pendientes',
      },
    });
  }
  openModal(message: string, title: string) {
    this.modalService.open({
      content: this.messageModal!,
      options: {
        size: 'small',
        message: message,
        title: title,
      },
    });
  }
}
